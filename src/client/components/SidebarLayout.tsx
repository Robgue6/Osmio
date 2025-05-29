// The 'wasp/auth' import is a framework-specific import from the Wasp.io platform
// and will work correctly when the application is built through the Wasp build process
import { type AuthUser } from 'wasp/auth';
import { useState, useEffect, ReactNode, FC } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../cn';
import { useTallyPopup } from '../hooks/useTallyPopup';

interface Props {
  user: AuthUser;
  children?: ReactNode;
}

const SidebarLayout: FC<Props> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Use the Tally popup hook
  useTallyPopup({
    formId: 'w8RVyO', // Replace with your actual Tally form ID
    userId: user.id,
  });

  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex min-h-screen w-full p-0 m-0 overflow-hidden dark:bg-gray-900'>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col overflow-y-auto bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-linear',
          {
            'w-72': sidebarOpen,
            '-translate-x-full w-72': !sidebarOpen && isMobile,
            'w-20': !sidebarOpen && !isMobile,
          }
        )}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-between gap-2 px-6 py-5 lg:py-6'>
          <NavLink to='/dashboard'>
            {sidebarOpen ? (
              <span className='text-xl font-bold text-white'>Wealth Delegate</span>
            ) : (
              <span className='text-xl font-bold text-white'>WD</span>
            )}
          </NavLink>

          <button
            onClick={toggleSidebar}
            aria-controls='sidebar'
            aria-expanded={sidebarOpen}
            className={cn('lg:block', { 'hidden': isMobile })}
          >
            {sidebarOpen ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            )}
          </button>
        </div>

        <div className='flex flex-col overflow-y-auto duration-300 ease-linear'>
          {/* Sidebar Menu */}
          <nav className={cn('mt-5 py-4 px-4 lg:mt-9', {'lg:px-2': !sidebarOpen})}>
            {sidebarOpen && (
              <div>
                <h3 className='mb-4 ml-4 text-sm font-semibold text-gray-300'>MENU</h3>
              </div>
            )}

            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* Delegate Menu Item */}
              <li>
                <NavLink
                  to='/dashboard/delegate'
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-2.5 rounded-sm py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700',
                      {
                        'bg-gray-700': isActive,
                        'px-4': sidebarOpen,
                        'px-2 justify-center': !sidebarOpen
                      }
                    )
                  }
                >
                  <svg
                    className='fill-current'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z'
                      fill=''
                    />
                    <path
                      d='M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z'
                      fill=''
                    />
                    <path
                      d='M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z'
                      fill=''
                    />
                    <path
                      d='M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z'
                      fill=''
                    />
                  </svg>
                  {sidebarOpen && <span>Déléguer</span>}
                </NavLink>
              </li>

              {/* My Operations Menu Item */}
              <li>
                <NavLink
                  to='/dashboard/operations'
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-2.5 rounded-sm py-2 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-700',
                      {
                        'bg-gray-700': isActive,
                        'px-4': sidebarOpen,
                        'px-2 justify-center': !sidebarOpen
                      }
                    )
                  }
                >
                  <svg
                    className='fill-current'
                    width='18'
                    height='19'
                    viewBox='0 0 18 19'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clipPath='url(#clip0_130_9756)'>
                      <path
                        d='M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z'
                        fill=''
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_130_9756'>
                        <rect width='18' height='18' fill='white' transform='translate(0 0.052124)' />
                      </clipPath>
                    </defs>
                  </svg>
                  {sidebarOpen && <span>Mes Opérations</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <div className={cn('flex-1 relative', {
        'ml-20': !sidebarOpen && !isMobile,
        'ml-0': !sidebarOpen && isMobile,
        'ml-72': sidebarOpen
      })}>
        {/* Header */}
        <header className='sticky top-0 z-40 flex w-full bg-transparent dark:bg-gray-800 shadow-sm'>
          <div className='flex flex-grow items-center justify-between py-3 px-4 md:px-6'>
            <div className='flex items-center gap-2 lg:hidden'>
              <button
                onClick={toggleSidebar}
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                className='z-50 block rounded-sm border border-gray-300 dark:border-gray-600 bg-transparent p-1.5 shadow-sm'
              >
                <span className='relative block h-5.5 w-5.5 cursor-pointer'>
                  <span className='du-block absolute right-0 h-full w-full'>
                    <span
                      className={cn('relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-800 dark:bg-white delay-[0] duration-200 ease-in-out', {
                        '!w-full delay-300': !sidebarOpen,
                      })}
                    ></span>
                    <span
                      className={cn('relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-800 dark:bg-white delay-150 duration-200 ease-in-out', {
                        '!w-full delay-400': !sidebarOpen,
                      })}
                    ></span>
                    <span
                      className={cn('relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-gray-800 dark:bg-white delay-200 duration-200 ease-in-out', {
                        '!w-full delay-500': !sidebarOpen,
                      })}
                    ></span>
                  </span>
                  <span className='absolute right-0 h-full w-full rotate-45'>
                    <span
                      className={cn('absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-gray-800 dark:bg-white delay-300 duration-200 ease-in-out', {
                        '!h-0 !delay-[0]': !sidebarOpen,
                      })}
                    ></span>
                    <span
                      className={cn('delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-gray-800 dark:bg-white duration-200 ease-in-out', {
                        '!h-0 !delay-200': !sidebarOpen,
                      })}
                    ></span>
                  </span>
                </span>
              </button>
              <NavLink to='/dashboard' className='block flex-shrink-0 lg:hidden'>
                <span className='text-xl font-bold text-gray-800 dark:text-white'>Wealth Delegate</span>
              </NavLink>
            </div>

            {/* Empty header right section */}
            <div className='flex items-center gap-3 2xsm:gap-7'>
              {/* Empty header right section */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout; 