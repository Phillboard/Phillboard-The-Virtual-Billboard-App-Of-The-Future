
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <Card className="w-[350px] bg-black/60 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? "Enter your credentials to access your account" 
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin 
          ? <LoginForm /> 
          : <SignupForm />
        }
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={() => setIsLogin(!isLogin)}
          className="text-neon-cyan"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
