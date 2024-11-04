'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const { register, handleSubmit, formState } = useForm<{ email: string }>();
  const { toast } = useToast();

  async function onSubmit(data: { email: string }) {
    try {
      signIn('nodemailer', { email: data.email, redirect: false });

      toast({
        title: 'Link Mágico Enviado',
        description: 'Verifique seu e-mail para o link mágico de login',
      });
    } catch (error) {
      console.log(error);

      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Por favor, tente novamente',
      });
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Digite seu e-mail abaixo para fazer login em sua conta
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            type="email"
            {...register('email')}
          />
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Enviando...' : 'Enviar Link Mágico'}
        </Button>
      </form>
    </div>
  );
}
