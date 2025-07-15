// src/components/ProfileEditModal.tsx
'use client';
import { useState, useCallback, FormEvent, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Modal from './Modal';
import { Input, Button, Label, InputGroup, FormWrapper } from './Styled';
import { theme } from '@/styles/theme';

// ... (Styled components are unchanged and correct)
const DropzoneWrapper = styled.div<{ $isDragActive: boolean }>` /* ... */ `;
const PreviewContainer = styled.div` /* ... */ `;
const PreviewImage = styled.img` /* ... */ `;
const FileName = styled.p` /* ... */ `;

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
    const { user, refreshUser } = useAuth();
    
    // --- THIS IS THE FIX ---
    // Initialize state with guaranteed empty strings.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // --- END OF FIX ---

    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This useEffect now safely populates the form once the user data is available.
    // It checks if 'user' exists before trying to access its properties.
    useEffect(() => {
        if (user && isOpen) {
            // We use the nullish coalescing operator (??) to provide a fallback
            // empty string, ensuring the state never becomes undefined.
            setName(user.name ?? '');
            setEmail(user.email ?? '');
            setPreview(user.profilePictureUrl ?? null);
            setProfilePictureFile(null); // Always reset the file input on open
        }
    }, [user, isOpen]); // This effect re-runs when the modal opens or the user data changes.

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setProfilePictureFile(file);
            const tempPreviewUrl = URL.createObjectURL(file);
            setPreview(tempPreviewUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (profilePictureFile) {
            formData.append('profilePicture', profilePictureFile);
        }

        try {
            await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await refreshUser(); 
            onClose();
        } catch (error) {
            alert('Failed to update profile. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile">
            <form onSubmit={handleSubmit}>
                <FormWrapper>
                    <InputGroup>
                        <Label htmlFor="profileName">Full Name</Label>
                        <Input id="profileName" value={name} onChange={(e) => setName(e.target.value)} />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="profileEmail">Email</Label>
                        <Input id="profileEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                    <InputGroup>
                        <Label>Profile Picture</Label>
                        <DropzoneWrapper {...getRootProps()} $isDragActive={isDragActive}>
                            <input {...getInputProps()} />
                            {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop new picture, or click to select</p>}
                        </DropzoneWrapper>
                        {preview && (
                            <PreviewContainer>
                                <Label>Picture Preview:</Label>
                                <PreviewImage src={preview} alt="Profile preview"/>
                                {profilePictureFile && <FileName>{profilePictureFile.name}</FileName>}
                            </PreviewContainer>
                        )}
                    </InputGroup>
                    <div style={{ marginTop: theme.spacing.lg }}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </FormWrapper>
            </form>
        </Modal>
    );
}