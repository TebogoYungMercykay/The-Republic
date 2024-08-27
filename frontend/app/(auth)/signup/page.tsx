"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Eye, EyeOff, UserPlus, Mail, User, Lock, Share2, AlertTriangle, MessageCircle, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          username,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to sign up, please try again",
      });
    } else {
      router.push("/");
    }
  };

  const floatingIcons = [
    { Icon: Share2, delay: 0 },
    { Icon: AlertTriangle, delay: 0.5 },
    { Icon: MessageCircle, delay: 1 },
    { Icon: Shield, delay: 1.5 },
    { Icon: TrendingUp, delay: 2 },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white dark:bg-transparent rounded-xl overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 p-10 bg-green-600 text-white relative overflow-hidden">
          <h2 className="text-3xl font-bold mb-6">Welcome to The Republic</h2>
          <p className="text-xl mb-6">Join us in revolutionizing citizen engagement</p>
          <ul className="space-y-4 text-lg relative z-10">
            <li className="flex items-center"><Share2 className="mr-3" size={24} /> Share experiences</li>
            <li className="flex items-center"><AlertTriangle className="mr-3" size={24} /> Report incidents</li>
            <li className="flex items-center"><MessageCircle className="mr-3" size={24} /> Voice concerns</li>
            <li className="flex items-center"><Shield className="mr-3" size={24} /> Enhance accountability</li>
            <li className="flex items-center"><TrendingUp className="mr-3" size={24} /> Improve services</li>
          </ul>
          {floatingIcons.map(({ Icon, delay }, index) => (
            <motion.div
              key={index}
              className="absolute text-green-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Icon size={48} />
            </motion.div>
          ))}
        </div>
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-semibold text-green-700 dark:text-green-500 mb-8">Create an Account</h2>
          <form onSubmit={signup} className="space-y-6">
            <div>
              <Label htmlFor="fullname" className="text-lg text-green-700 dark:text-green-500">Full Name</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full mt-2 text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Enter your full name"
                />
                <UserPlus className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={20} />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-lg text-green-700 dark:text-green-500">Email</Label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Enter your email"
                />
                <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={20} />
              </div>
            </div>
            <div>
              <Label htmlFor="username" className="text-lg text-green-700 dark:text-green-500">Username</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-2 text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Choose a username"
                />
                <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={20} />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-lg text-green-700 dark:text-green-500">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 text-lg pl-10 pr-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Create a strong password"
                />
                <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 dark:text-green-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-md transition duration-300">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-base text-green-600 dark:text-green-400">
            Already have an account? <a href="/login" className="text-green-700 dark:text-green-300 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}