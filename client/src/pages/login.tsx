import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900/20 p-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Sistema de Permuta</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Aceda à plataforma para gerir as permutas
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            >
              Iniciar Sessão
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Ao iniciar sessão, concorda com os nossos{" "}
            <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Política de Privacidade
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
