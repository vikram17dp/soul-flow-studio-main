
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Calculator } from "lucide-react";

const HealthAssessmentSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 0,
      question: "What is your primary health goal?",
      options: [
        { value: "weight-loss", label: "Lose weight sustainably" },
        { value: "diabetes", label: "Manage/reverse diabetes" },
        { value: "pcos", label: "Address PCOS symptoms" },
        { value: "thyroid", label: "Optimize thyroid function" },
        { value: "overall", label: "Overall wellness improvement" }
      ]
    },
    {
      id: 1,
      question: "How would you describe your current energy levels?",
      options: [
        { value: "low", label: "Often tired and sluggish" },
        { value: "moderate", label: "Some good days, some bad" },
        { value: "good", label: "Generally energetic" },
        { value: "excellent", label: "High energy most days" }
      ]
    },
    {
      id: 2,
      question: "Which best describes your eating habits?",
      options: [
        { value: "irregular", label: "Irregular meal times" },
        { value: "processed", label: "Mostly processed foods" },
        { value: "mixed", label: "Mix of healthy and unhealthy" },
        { value: "healthy", label: "Mostly whole foods" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getPersonalizedRecommendation = () => {
    const goal = answers[0];
    const energy = answers[1];
    const eating = answers[2];

    if (goal === "diabetes") {
      return {
        title: "Diabetes Management Program",
        description: "Based on your responses, our diabetes reversal program would be perfect for you.",
        features: ["Blood sugar monitoring", "Low-carb meal plans", "Expert endocrinologist support"]
      };
    } else if (goal === "weight-loss") {
      return {
        title: "Smart Weight Loss Program",
        description: "Our AI-powered weight management system will help you achieve sustainable results.",
        features: ["Personalized calorie targets", "Macro tracking", "Weekly dietitian check-ins"]
      };
    } else if (goal === "pcos") {
      return {
        title: "PCOS Support Program",
        description: "Comprehensive hormonal balance program designed specifically for PCOS management.",
        features: ["Hormone-balancing nutrition", "PCOS-specific exercises", "Fertility support"]
      };
    } else {
      return {
        title: "Holistic Wellness Program",
        description: "A comprehensive approach to transform your overall health and vitality.",
        features: ["Complete health assessment", "Multi-disciplinary support", "Lifestyle optimization"]
      };
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const recommendation = getPersonalizedRecommendation();
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-green-50 to-purple-50 border-0 shadow-xl">
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Your Personalized Health Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recommendation.title}</h3>
                <p className="text-gray-600 mb-4">{recommendation.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendation.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Your Transformation
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Personalized Health Plan
          </h2>
          <p className="text-xl text-gray-600">
            Take our quick assessment to get customized recommendations
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Calculator className="h-5 w-5 text-green-600" />
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <CardTitle className="text-xl font-bold text-gray-900">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              value={answers[currentQuestion] || ""} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              onClick={nextQuestion} 
              disabled={!answers[currentQuestion]}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {currentQuestion === questions.length - 1 ? "Get My Plan" : "Next Question"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HealthAssessmentSection;
