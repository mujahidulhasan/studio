
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';


const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type AuthFormValues = z.infer<typeof authSchema>;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getFirebaseErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email address.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled.';
        case 'auth/weak-password':
            return 'The password is too weak.';
        default:
            return 'An unknown error occurred. Please try again.';
    }
}

const AuthForm = ({ isLogin, onFormSubmit, isLoading }: { isLogin: boolean, onFormSubmit: SubmitHandler<AuthFormValues>, isLoading: boolean }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema)
  });

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={isLogin ? "login-email" : "signup-email"}>Email</Label>
        <Input id={isLogin ? "login-email" : "signup-email"} type="email" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={isLogin ? "login-password" : "signup-password"}>Password</Label>
        <Input id={isLogin ? "login-password" : "signup-password"} type="password" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLogin ? 'Log In' : 'Sign Up'}
      </Button>
    </form>
  )
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (values: AuthFormValues, action: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      if (action === 'login') {
        await login(values);
      } else {
        await signup(values);
      }
      toast({
        title: action === 'login' ? 'Login successful' : 'Signup successful',
        description: "Welcome!",
      });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: getFirebaseErrorMessage(error),
          });
      } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred.",
          });
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Log in or create an account to save your designs.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm isLogin={true} onFormSubmit={(data) => handleAuthAction(data, 'login')} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm isLogin={false} onFormSubmit={(data) => handleAuthAction(data, 'signup')} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
