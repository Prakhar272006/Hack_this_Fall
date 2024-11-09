'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Confetti } from "@/components/effects/confetti"
import confetti from 'canvas-confetti';


export default function ReportPage() {
    const [report, setReport] = useState({
        description: '',
        photo: null as File | null,
        location: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showRewardDialog, setShowRewardDialog] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReport(prev => ({ ...prev, photo: file }));
        }
    };

    const triggerSideCannons = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
        const frame = () => {
            if (Date.now() > end) return;
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });
            requestAnimationFrame(frame);
        };
        frame();
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Submitting report...');
        try {
            const response = await fetch('/api/analyze-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: report.description,
                    photo: report.photo ? await convertFileToBase64(report.photo) : null,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report');
            }

            const result = await response.json();
            console.log('Report submitted:', result);
            toast.dismiss(loadingToast);
            toast.success('Report submitted successfully');

            setRewardPoints(Math.floor(Math.random() * 50) + 10); // Random points between 10 and 59
            setShowRewardDialog(true);
            triggerSideCannons();
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.dismiss(loadingToast);
            toast.error('Error submitting report');
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-12 pt-20 px-4 md:px-6">
            <div className="absolute top-0 left-0 w-full">
                <Navbar />
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Report an Incident</h1>
                    <p className="text-muted-foreground">Use this form to report an incident or issue that requires attention.</p>
                </div>
                <Card>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="photo" className='text-sm pt-2'>Photo</Label>
                            <div className="relative">
                                <img
                                    src={report.photo ? URL.createObjectURL(report.photo) : "/placeholder.svg"}
                                    width="400"
                                    height="300"
                                    alt="Incident Photo"
                                    className="aspect-[4/3] w-full rounded-md object-cover"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    className="absolute bottom-4 right-4 z-10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <UploadIcon className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                            </div>                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide details about the incident..."
                                className="min-h-[150px]"
                                value={report.description}
                                onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" type="button">Cancel</Button>
                        <Button type="submit" onClick={handleSubmit}>Submit Report</Button>
                    </CardFooter>
                </Card>
            </div>
            <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thank you for your report!</DialogTitle>
                    </DialogHeader>
                    <p>You&apos;ve earned {rewardPoints} points for this report.</p>
                    <p>Your contribution helps improve our community.</p>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function UploadIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}


function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}