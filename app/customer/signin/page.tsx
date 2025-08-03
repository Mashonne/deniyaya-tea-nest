import SignInForm from '@/components/customer/SigninForm';

export default function CustomerSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Customer Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in customer dashboard
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}