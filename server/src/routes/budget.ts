// src/routes/budgets.ts
import { Router } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Budget, BudgetStatus } from '../entity/Budget';
import { protect, authorizeProgramManager, authorizeAdmin, authorizeFinancialManager } from '../middleware/authMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';
import { Category } from '../entity/Category';
import { Item } from '../entity/Item';
import { UserRole } from '../entity/User';

const router = Router();
// This protects all routes in this file, ensuring a user must be logged in.
router.use(protect);

// @route   GET /api/budgets/summary
// @desc    Get dashboard summary statistics
// @access  Private (All authenticated users)
router.get('/summary', async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    try {
        const budgetRepo = getRepository(Budget);
        const totalApprovedAmountResult = await budgetRepo.createQueryBuilder("budget")
            .select("SUM(budget.totalAmount)", "sum")
            .where("budget.status = :status", { status: BudgetStatus.APPROVED })
            .getRawOne();
        const statusCountsResult = await budgetRepo.createQueryBuilder("budget")
            .select("budget.status", "status")
            .addSelect("COUNT(budget.id)", "count")
            .groupBy("budget.status")
            .getRawMany();
        const summary = {
            totalApprovedAmount: parseFloat(totalApprovedAmountResult.sum) || 0,
            statusCounts: statusCountsResult.reduce((acc: any, item: any) => {
                acc[item.status] = parseInt(item.count, 10);
                return acc;
            }, {}),
            totalBudgets: await budgetRepo.count(),
        };
        res.json(summary);
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private (Financial Manager or Admin)
router.post('/', authorizeFinancialManager, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { name, program, categories } = req.body;
    if (!name || !categories || !Array.isArray(categories)) {
        return res.status(400).json({ message: 'Budget name and a valid categories array are required.' });
    }

    try {
        const budgetRepo = getRepository(Budget);
        let totalAmount = 0;

        const processedCategories = categories.map((catData: any) => {
            const newCategory = new Category();
            newCategory.name = catData.name;
            newCategory.items = catData.items.map((itemData: any) => {
                const newItem = new Item();
                newItem.name = itemData.name;
                newItem.quantity = Number(itemData.quantity) || 0;
                newItem.unitPrice = Number(itemData.unitPrice) || 0;
                newItem.period = itemData.period;
                newItem.totalPrice = newItem.quantity * newItem.unitPrice;
                totalAmount += newItem.totalPrice;
                return newItem;
            });
            return newCategory;
        });

        const newBudget = budgetRepo.create({
            name,
            program,
            totalAmount,
            userId: req.user.id,
            status: BudgetStatus.PENDING_APPROVAL,
            categories: processedCategories,
        });

        const savedBudget = await budgetRepo.save(newBudget);
        res.status(201).json(savedBudget);
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).json({ message: 'Server Error while creating budget.' });
    }
});

// @route   GET /api/budgets
// @desc    Get all budgets for all users (for simplicity, can be scoped later)
// @access  Private (All authenticated users)
router.get('/', async (req, res) => {
    try {
        const budgets = await getRepository(Budget).find({
            order: { createdAt: 'DESC' },
            relations: ['createdBy']
        });
        res.json(budgets);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/budgets/:id
// @desc    Get a single budget by its ID
// @access  Private (All authenticated users)
router.get('/:id', async (req, res) => {
    try {
        const budget = await getRepository(Budget).findOne({
            where: { id: req.params.id },
            relations: ["createdBy", "categories", "categories.items"]
        });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(budget);
    } catch (error) {
        console.error("Error fetching single budget:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/budgets/:id
// @desc    Update an existing budget
// @access  Private (Financial Manager who created it, or Admin)
router.put('/:id', authorizeFinancialManager, async (req: AuthRequest, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    await getConnection().transaction(async transactionalEntityManager => {
        const budgetRepo = transactionalEntityManager.getRepository(Budget);
        const budgetToUpdate = await budgetRepo.findOne({
            where: { id: req.params.id },
            relations: ["categories", "categories.items"]
        });
        
        if (!budgetToUpdate) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        const isCreator = budgetToUpdate.userId === req.user!.id;
        const isAdmin = req.user!.role === UserRole.ADMIN;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: 'User not authorized to edit this budget.' });
        }
        
        const itemRepo = transactionalEntityManager.getRepository(Item);
        const categoryRepo = transactionalEntityManager.getRepository(Category);

        for (const category of budgetToUpdate.categories) {
            if (category.items && category.items.length > 0) {
                await itemRepo.remove(category.items);
            }
        }
        await categoryRepo.remove(budgetToUpdate.categories);

        const { name, program, categories: newCategoriesData } = req.body;
        let totalAmount = 0;
        const processedCategories = newCategoriesData.map((catData: any) => {
            const newCategory = new Category();
            newCategory.name = catData.name;
            newCategory.items = catData.items.map((itemData: any) => {
                const newItem = new Item();
                newItem.name = itemData.name;
                newItem.quantity = Number(itemData.quantity) || 0;
                newItem.unitPrice = Number(itemData.unitPrice) || 0;
                newItem.period = itemData.period;
                newItem.totalPrice = newItem.quantity * newItem.unitPrice;
                totalAmount += newItem.totalPrice;
                return newItem;
            });
            return newCategory;
        });

        budgetToUpdate.name = name;
        budgetToUpdate.program = program;
        budgetToUpdate.totalAmount = totalAmount;
        budgetToUpdate.categories = processedCategories;
        budgetToUpdate.status = BudgetStatus.PENDING_APPROVAL;
        budgetToUpdate.statusComment = "Edited - Awaiting re-approval.";

        const updatedBudget = await budgetRepo.save(budgetToUpdate);
        res.json(updatedBudget);
    }).catch(error => {
        if (!res.headersSent) {
            console.error("Error updating budget in transaction:", error);
            res.status(500).json({ message: 'Server Error during budget update.' });
        }
    });
});

// @route   PATCH /api/budgets/:id/status
// @desc    Update a budget's approval status
// @access  Private (Program Manager or Admin)
router.patch('/:id/status', authorizeProgramManager, async (req, res) => {
    try {
        const { status, comment } = req.body;
        if (!status || !Object.values(BudgetStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }
        if ((status === BudgetStatus.REJECTED || status === BudgetStatus.CHANGES_REQUESTED) && !comment) {
            return res.status(400).json({ message: 'A comment is required for this action.' });
        }

        const budgetRepo = getRepository(Budget);
        const budget = await budgetRepo.findOne({ where: { id: req.params.id } });
        if (!budget) { 
            return res.status(404).json({ message: 'Budget not found' }); 
        }
        
        budget.status = status;
        budget.statusComment = (status === BudgetStatus.APPROVED) ? "" : comment;
        
        const updatedBudget = await budgetRepo.save(budget);
        res.json(updatedBudget);
    } catch (error) {
        console.error("Error updating budget status:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private (Admin only)
router.delete('/:id', authorizeAdmin, async (req, res) => {
    try {
        const budgetRepo = getRepository(Budget);
        const result = await budgetRepo.delete(req.params.id);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (error) {
        console.error("Error deleting budget:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;