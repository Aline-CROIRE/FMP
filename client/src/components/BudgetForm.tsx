// src/components/BudgetForm.tsx
'use client';
import { useState, FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Button, Label, FormWrapper as BaseFormWrapper } from './Styled';
import { theme } from '@/styles/theme';

// --- Type Definitions ---
export interface ItemData {
    name: string;
    quantity: number;
    unitPrice: number;
    period?: string;
}
export interface CategoryData {
    name: string;
    items: ItemData[];
}
export interface BudgetFormData {
    name: string;
    program: string;
    categories: CategoryData[];
}

// --- Styled Components ---
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
    max-height: 70vh;
    overflow-y: auto;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    margin-right: -${theme.spacing.sm};
`;
const Section = styled.div`
    background-color: ${theme.colors.bgSecondary};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius};
    border: 1px solid ${theme.colors.border};
`;
const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
`;
const SectionTitle = styled.h4`
    margin: 0;
    color: ${theme.colors.textHeading};
    font-size: ${theme.fontSizes.lg};
    font-weight: 600;
`;
const BudgetDetailsWrapper = styled(BaseFormWrapper)`
    gap: ${theme.spacing.lg};
`;
const CategorySection = styled(Section)`
    margin-bottom: ${theme.spacing.lg};
`;
const ItemGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
`;
const ItemDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: ${theme.spacing.md};
    align-items: flex-end;
`;
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    width: 100%;
`;
const ItemRowHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${theme.spacing.lg};
`;
const ItemLabel = styled(Label)`
    font-weight: 600;
    color: ${theme.colors.textLight};
`;
const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: ${theme.colors.textMuted};
    cursor: pointer;
    padding: ${theme.spacing.sm};
    border-radius: 4px;
    line-height: 1;
    transition: ${theme.transitions.main};
    
    &:hover { 
        background: ${theme.colors.redError};
        color: white;
    }
`;
const AddButton = styled.button`
    width: 100%;
    color: ${theme.colors.primary};
    border: 1px dashed ${theme.colors.primary};
    background: transparent;
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    font-weight: 600;
    transition: ${theme.transitions.main};
    
    &:hover { 
        color: white; 
        background-color: ${theme.colors.primaryHover};
        border-style: solid;
    }
`;

// --- The Form Component ---
interface BudgetFormProps {
    onSubmit: (data: BudgetFormData) => void;
    isSubmitting: boolean;
    initialData?: BudgetFormData;
}

export default function BudgetForm({ onSubmit, isSubmitting, initialData }: BudgetFormProps) {
    const [formData, setFormData] = useState<BudgetFormData>({
        name: '',
        program: '',
        categories: [{ name: '', items: [{ name: '', quantity: 1, unitPrice: 0 }] }],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                program: initialData.program || '',
                categories: initialData.categories?.length > 0 ? initialData.categories : [{ name: '', items: [{ name: '', quantity: 1, unitPrice: 0 }] }],
            });
        }
    }, [initialData]);

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleCategoryChange = (catIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newCategories = [...formData.categories];
        newCategories[catIndex].name = e.target.value;
        setFormData(prev => ({ ...prev, categories: newCategories }));
    };
    const handleItemChange = (catIndex: number, itemIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newCategories = [...formData.categories];
        const items = newCategories[catIndex].items;
        (items[itemIndex] as any)[e.target.name] = e.target.value;
        setFormData(prev => ({ ...prev, categories: newCategories }));
    };
    const addCategory = () => {
        setFormData(prev => ({ ...prev, categories: [...prev.categories, { name: '', items: [{ name: '', quantity: 1, unitPrice: 0 }] }] }));
    };
    const addItem = (catIndex: number) => {
        const newCategories = [...formData.categories];
        newCategories[catIndex].items.push({ name: '', quantity: 1, unitPrice: 0 });
        setFormData(prev => ({ ...prev, categories: newCategories }));
    };
    const removeCategory = (catIndex: number) => {
        const newCategories = formData.categories.filter((_, index) => index !== catIndex);
        setFormData(prev => ({ ...prev, categories: newCategories }));
    };
    const removeItem = (catIndex: number, itemIndex: number) => {
        const newCategories = [...formData.categories];
        newCategories[catIndex].items = newCategories[catIndex].items.filter((_, index) => index !== itemIndex);
        setFormData(prev => ({ ...prev, categories: newCategories }));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormContainer>
                <Section>
                    <SectionHeader><SectionTitle>Budget Details</SectionTitle></SectionHeader>
                    <BudgetDetailsWrapper>
                        <InputGroup>
                            <Label htmlFor="budgetName">Budget Name</Label>
                            <Input id="budgetName" name="name" value={formData.name} onChange={handleBudgetChange} required placeholder="e.g., Q4 Marketing Training" />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="program">Program (Optional)</Label>
                            <Input id="program" name="program" value={formData.program} onChange={handleBudgetChange} placeholder="e.g., kLab Fellowship" />
                        </InputGroup>
                    </BudgetDetailsWrapper>
                </Section>
                {formData.categories.map((category, catIndex) => (
                    <CategorySection key={catIndex}>
                        <SectionHeader>
                            <SectionTitle>Category #{catIndex + 1}</SectionTitle>
                            {formData.categories.length > 1 && <RemoveButton type="button" onClick={() => removeCategory(catIndex)}>Remove</RemoveButton>}
                        </SectionHeader>
                        <InputGroup style={{marginBottom: theme.spacing.xl}}>
                            <Label htmlFor={`categoryName-${catIndex}`}>Category Name</Label>
                            <Input id={`categoryName-${catIndex}`} name="name" value={category.name} onChange={(e) => handleCategoryChange(catIndex, e)} required placeholder="e.g., Event Costs" />
                        </InputGroup>
                        {category.items.map((item, itemIndex) => (
                            <div key={itemIndex}>
                                <ItemRowHeader>
                                    <ItemLabel>Item #{itemIndex + 1}</ItemLabel>
                                    <RemoveButton type="button" onClick={() => removeItem(catIndex, itemIndex)} disabled={category.items.length <= 1}>×</RemoveButton>
                                </ItemRowHeader>
                                <ItemGrid>
                                    <InputGroup>
                                        <Label>Item Name</Label>
                                        <Input name="name" value={item.name} onChange={(e) => handleItemChange(catIndex, itemIndex, e)} required placeholder="e.g. Venue Rental" />
                                    </InputGroup>
                                    <ItemDetailsGrid>
                                        <InputGroup><Label>Qty</Label><Input name="quantity" type="number" min="0" value={item.quantity} onChange={(e) => handleItemChange(catIndex, itemIndex, e)} /></InputGroup>
                                        <InputGroup><Label>Unit Price</Label><Input name="unitPrice" type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(catIndex, itemIndex, e)} /></InputGroup>
                                        <InputGroup><Label>Period</Label><Input name="period" value={item.period || ''} onChange={(e) => handleItemChange(catIndex, itemIndex, e)} placeholder="e.g. 3 months" /></InputGroup>
                                    </ItemDetailsGrid>
                                </ItemGrid>
                            </div>
                        ))}
                        <AddButton type="button" onClick={() => addItem(catIndex)} style={{marginTop: theme.spacing.lg}}>+ Add Item</AddButton>
                    </CategorySection>
                ))}
                <AddButton type="button" onClick={addCategory} style={{marginTop: 0, borderStyle: 'solid'}}>+ Add New Category</AddButton>
            </FormContainer>
            <div style={{marginTop: theme.spacing.xl, paddingTop: theme.spacing.lg, borderTop: `1px solid ${theme.colors.border}`}}>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Budget' : 'Create Budget')}
                </Button>
            </div>
        </form>
    );
}