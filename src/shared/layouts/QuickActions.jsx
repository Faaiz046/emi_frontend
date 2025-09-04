import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectQuickActions, toggleQuickActions } from '../../store/slices/layoutSlice';
import { Button } from '../components/ui/Button';
import {
  PlusIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowUpIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const dispatch = useAppDispatch();
  const quickActions = useAppSelector(selectQuickActions);

  const getPositionClasses = () => {
    switch (quickActions.position) {
      case 'bottom-right':
        return 'bottom-20 right-6';
      case 'bottom-left':
        return 'bottom-20 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-20 right-6';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => dispatch(toggleQuickActions())}
        className="w-12 h-12 rounded-full shadow-lg mb-3"
      >
        {quickActions.isVisible ? (
          <ChevronDownIcon className="w-5 h-5" />
        ) : (
          <ChevronUpIcon className="w-5 h-5" />
        )}
      </Button>

      {/* Quick Actions Menu */}
      {quickActions.isVisible && (
        <div className="flex flex-col space-y-3 animate-in fade-in-50 slide-in-from-bottom-3 duration-200">
          {/* Scroll to top */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </Button>

          {/* Quick add */}
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <CogIcon className="w-5 h-5" />
          </Button>

          {/* Help */}
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickActions; 