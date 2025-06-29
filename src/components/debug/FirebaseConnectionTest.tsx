import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export const FirebaseConnectionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results: TestResult[] = [];

    // Test 1: Firebase Auth initialization
    try {
      if (auth && auth.app) {
        results.push({
          test: 'Firebase Auth Initialization',
          status: 'pass',
          message: `Firebase Auth initialized successfully for project: ${auth.app.options.projectId}`
        });
      } else {
        results.push({
          test: 'Firebase Auth Initialization',
          status: 'fail',
          message: 'Firebase Auth failed to initialize'
        });
      }
    } catch (error) {
      results.push({
        test: 'Firebase Auth Initialization',
        status: 'fail',
        message: `Firebase Auth error: ${error}`
      });
    }

    // Test 2: Current domain check
    const currentDomain = window.location.hostname;
    const expectedDomains = ['localhost', '127.0.0.1', 'shuddha-32217.firebaseapp.com'];
    
    if (expectedDomains.includes(currentDomain)) {
      results.push({
        test: 'Domain Authorization',
        status: 'pass',
        message: `Current domain "${currentDomain}" should be authorized in Firebase Console`
      });
    } else {
      results.push({
        test: 'Domain Authorization',
        status: 'warning',
        message: `Current domain "${currentDomain}" may need to be added to Firebase Console authorized domains`
      });
    }

    // Test 3: reCAPTCHA container
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      results.push({
        test: 'reCAPTCHA Container',
        status: 'pass',
        message: 'reCAPTCHA container found in DOM'
      });
    } else {
      results.push({
        test: 'reCAPTCHA Container',
        status: 'fail',
        message: 'reCAPTCHA container not found - this will cause OTP to fail'
      });
    }

    // Test 4: Firebase configuration
    try {
      const config = auth.app.options;
      const requiredFields = ['apiKey', 'authDomain', 'projectId'];
      const missingFields = requiredFields.filter(field => !config[field]);
      
      if (missingFields.length === 0) {
        results.push({
          test: 'Firebase Configuration',
          status: 'pass',
          message: 'All required Firebase configuration fields are present'
        });
      } else {
        results.push({
          test: 'Firebase Configuration',
          status: 'fail',
          message: `Missing configuration fields: ${missingFields.join(', ')}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Firebase Configuration',
        status: 'fail',
        message: `Error checking Firebase configuration: ${error}`
      });
    }

    // Test 5: App verification settings
    const isLocalhost = window.location.hostname === 'localhost';
    if (isLocalhost) {
      results.push({
        test: 'Development Settings',
        status: auth.settings.appVerificationDisabledForTesting ? 'pass' : 'warning',
        message: auth.settings.appVerificationDisabledForTesting 
          ? 'App verification disabled for localhost testing'
          : 'App verification not disabled - may cause issues on localhost'
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Running Firebase Connection Tests...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Testing Firebase configuration...</div>
        </CardContent>
      </Card>
    );
  }

  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const totalTests = testResults.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Firebase Connection Test Results
          <Badge variant={passedTests === totalTests ? 'default' : 'destructive'}>
            {passedTests}/{totalTests} Passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
            {getStatusIcon(result.status)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{result.test}</h4>
                {getStatusBadge(result.status)}
              </div>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Quick Test Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>If all tests pass, try OTP with test number: <code>+91-1234567890</code></li>
            <li>Use OTP code: <code>123456</code> (if test numbers are configured in Firebase)</li>
            <li>Check browser console for detailed error messages</li>
            <li>Ensure domain is whitelisted in Firebase Console</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
