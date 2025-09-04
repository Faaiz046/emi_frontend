import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import {
  Spinner,
  LoadingSpinner,
  SmallSpinner,
  LargeSpinner,
  PageSpinner,
  InlineSpinner,
  SimpleSpinner,
  // Advanced spinners
  SuccessSpinner,
  WarningSpinner,
  ErrorSpinner,
  InfoSpinner,
  RainbowSpinner,
  GradientSpinner,
  DotsSpinner,
  FastSpinner,
  SlowSpinner,
  PulseSpinner,
  BounceSpinner,
  DynamicSpinner,
  RingSpinner,
  OutlineSpinner,
  ProgressSpinner,
  MultiSpinner,
} from './Spinner';

const SpinnerShowcase = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false);
            return 0;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleProgressDemo = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">🎨 Feature-Rich Spinner Components</h1>
      
      {/* Basic Spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Spinners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
            <Spinner size="2xl" />
          </div>
        </CardContent>
      </Card>

      {/* Color Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Spinner variant="default" />
              <p className="text-sm mt-2">Default</p>
            </div>
            <div className="text-center">
              <Spinner variant="success" />
              <p className="text-sm mt-2">Success</p>
            </div>
            <div className="text-center">
              <Spinner variant="warning" />
              <p className="text-sm mt-2">Warning</p>
            </div>
            <div className="text-center">
              <Spinner variant="error" />
              <p className="text-sm mt-2">Error</p>
            </div>
            <div className="text-center">
              <Spinner variant="info" />
              <p className="text-sm mt-2">Info</p>
            </div>
            <div className="text-center">
              <Spinner variant="secondary" />
              <p className="text-sm mt-2">Secondary</p>
            </div>
            <div className="text-center">
              <Spinner variant="light" />
              <p className="text-sm mt-2">Light</p>
            </div>
            <div className="text-center">
              <Spinner variant="dark" />
              <p className="text-sm mt-2">Dark</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Special Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <RainbowSpinner />
              <p className="text-sm mt-2">Rainbow</p>
            </div>
            <div className="text-center">
              <GradientSpinner />
              <p className="text-sm mt-2">Gradient</p>
            </div>
            <div className="text-center">
              <DotsSpinner />
              <p className="text-sm mt-2">Dots</p>
            </div>
            <div className="text-center">
              <RingSpinner />
              <p className="text-sm mt-2">Ring</p>
            </div>
            <div className="text-center">
              <OutlineSpinner />
              <p className="text-sm mt-2">Outline</p>
            </div>
            <div className="text-center">
              <DynamicSpinner />
              <p className="text-sm mt-2">Dynamic</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speed Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Speed Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <SlowSpinner />
              <p className="text-sm mt-2">Slow</p>
            </div>
            <div className="text-center">
              <Spinner speed="normal" />
              <p className="text-sm mt-2">Normal</p>
            </div>
            <div className="text-center">
              <FastSpinner />
              <p className="text-sm mt-2">Fast</p>
            </div>
            <div className="text-center">
              <PulseSpinner />
              <p className="text-sm mt-2">Pulse</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Convenience Components */}
      <Card>
        <CardHeader>
          <CardTitle>Convenience Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <SmallSpinner />
              <p className="text-sm mt-2">SmallSpinner</p>
            </div>
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-sm mt-2">LoadingSpinner</p>
            </div>
            <div className="text-center">
              <LargeSpinner />
              <p className="text-sm mt-2">LargeSpinner</p>
            </div>
            <div className="text-center">
              <InlineSpinner />
              <p className="text-sm mt-2">InlineSpinner</p>
            </div>
            <div className="text-center">
              <SimpleSpinner />
              <p className="text-sm mt-2">SimpleSpinner</p>
            </div>
            <div className="text-center">
              <MultiSpinner count={5} />
              <p className="text-sm mt-2">MultiSpinner</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Spinner */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Spinner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <ProgressSpinner 
              progress={progress} 
              text={`Processing... ${progress}%`}
              showPercentage={true}
            />
            <Button onClick={handleProgressDemo} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Start Progress Demo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsLoading(!isLoading)}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <InlineSpinner />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Start Loading'
                )}
              </Button>
              
              {isLoading && (
                <div className="flex items-center gap-4">
                  <SuccessSpinner text="Success!" />
                  <WarningSpinner text="Warning..." />
                  <ErrorSpinner text="Error occurred" />
                  <InfoSpinner text="Processing..." />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Customization Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Spinner 
                variant="success" 
                size="xl" 
                text="Custom Success Spinner"
                textColor="text-green-600"
                textSize="lg"
              />
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Spinner 
                variant="info" 
                size="xl" 
                text="Custom Info Spinner"
                textColor="text-blue-600"
                textSize="lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinnerShowcase; 