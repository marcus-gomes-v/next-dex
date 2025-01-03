import { Transition } from '@headlessui/react';
import { Spin } from 'antd';

type NotificationType = 'loading' | 'error';

interface NotificationProps {
  show: boolean;
  type: NotificationType;
  message?: string;
}

export default function SwapNotification({ show, type, message }: NotificationProps) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-center justify-center p-4"
    >
      <div className="flex w-full flex-col items-center space-y-4">
        <Transition
          show={show}
          enter="transform duration-300 ease-out"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transform duration-100 ease-in"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-2 opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm rounded-lg bg-[#0E111B] p-6 shadow-lg ring-1 ring-black/5">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                {type === 'loading' ? (
                  <>
                    <Spin size="large" />
                    <p className="text-sm text-white">Processing Swap...</p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">{message || 'Transaction rejected'}</p>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}