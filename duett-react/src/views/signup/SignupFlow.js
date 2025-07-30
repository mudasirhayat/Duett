import React, { useEffect, useState } from 'react';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import useSignupStore from '../../store/signup';

const SignupFlow = () => {
  const {
    setProfileData,
    setFundingSources,
    setServices,
    setCounties,
    setDocuments,
    loadTokensFromStorage,
    profileData,
    fundingSources,
    services,
    counties,
    documents,
  } = useSignupStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    // Load tokens and user ID from localStorage into Zustand and the component state
    loadTokensFromStorage();
    const storedAuthToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAuthToken) setAuthToken(storedAuthToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);

    // Load the saved step and profile data from localStorage
    const savedStep = localStorage.getItem('signup_step');
    const savedProfileData = JSON.parse(
      localStorage.getItem('signup_profileData')
    );
    const savedFundingSources = JSON.parse(
      localStorage.getItem('signup_fundingSources')
    );
    const savedServices = JSON.parse(localStorage.getItem('signup_services'));
    const savedCounties = JSON.parse(localStorage.getItem('signup_counties'));
    const savedDocuments = JSON.parse(localStorage.getItem('signup_documents'));

    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    if (savedProfileData) {
      setProfileData(savedProfileData);
    }
    if (savedFundingSources) {
      setFundingSources(savedFundingSources);
    }
    if (savedServices) {
      setServices(savedServices);
    }
    if (savedCounties) {
      setCounties(savedCounties);
    }
    if (savedDocuments) {
      setDocuments(savedDocuments);
    }

    setLoading(false); // Mark loading as complete
  }, [
    loadTokensFromStorage,
    setProfileData,
    setFundingSources,
    setServices,
    setCounties,
    setDocuments,
  ]);

  useEffect(() => {
    // Save current step and data to localStorage
    localStorage.setItem('signup_step', currentStep.toString());
    localStorage.setItem('signup_profileData', JSON.stringify(profileData));
    localStorage.setItem(
      'signup_fundingSources',
      JSON.stringify(fundingSources)
    );
    localStorage.setItem('signup_services', JSON.stringify(services));
    localStorage.setItem('signup_counties', JSON.stringify(counties));
    localStorage.setItem('signup_documents', JSON.stringify(documents));
  }, [currentStep, profileData, fundingSources, services, counties, documents]);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0)); // Prevent going below Step 0
  };

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner or animation here
  }

  const steps = [
    <Step0
      handleNextStep={handleNextStep}
      setAuthToken={setAuthToken}
      setRefreshToken={setRefreshToken}
    />,
    <Step1 handleNextStep={handleNextStep} authToken={authToken} />,
    <Step2
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      authToken={authToken}
    />,
    <Step3
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      authToken={authToken}
    />,
    <Step4
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      authToken={authToken}
    />,
    <Step5
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      authToken={authToken}
    />,
    <Step6 authToken={authToken} />,
  ];

  return <div>{steps[currentStep]}</div>;
};

export default SignupFlow;
