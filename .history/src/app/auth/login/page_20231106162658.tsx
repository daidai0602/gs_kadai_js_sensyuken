"use client";

import { auth } from '@/app/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      const user = userCredential.user;
      router.push("/");
    })
    .catch((error) => {
      // alert(error);
      if (error.code === "auth/invalid-login-credentials"){
        alert("そのようなユーザーは存在しません。");
      } else {
        alert(error.message);
      }
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form  onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96" >
          <h1 className="mb-4 text-gray-700 text-2x1 font-medium">ログイン</h1>
            <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input {...register("email",{
                  required: "メールアドレスは必須です。",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                      message: "不適切なメールアドレスです。",
                  },
                })}
                type="text"
                className="mt-1 border-2 rounded-md w-full p-2"
                />
                {errors.email && <span class="text-red-600 text-sm"> {errors.email.message}</span>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                {...register("password",{
                  required: "パスワードは必須です。",
                  minLength: {
                    value: 6,
                    message: "6文字以上入力してください。",
                  }
                })}
                  type="password" className="mt-1 border-2 rounded-md w-full p-2" />
                  {errors.password && <span class="text-red-600 text-sm"> {errors.password.message}</span>}
            </div>

            <div className="flex justify-end">
              <button
              type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:text-blue-700">ログイン
              </button>
            </div>
            <div className="mt-4">
            <span className="text-gray-600 text-sm">
              初めてのご利用の方はこちら
            </span>
            <Link
            href={"/auth/register"}
            className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700">
              新規登録ページへ
            </Link>
          </div>

        </form>
      </div>
  );
};

export default Login;