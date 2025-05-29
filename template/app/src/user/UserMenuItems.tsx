import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { TfiDashboard } from 'react-icons/tfi';
import { cn } from '../client/cn';

export const UserMenuItems = ({ user, setMobileMenuOpen }: { user?: Partial<User>; setMobileMenuOpen?: any }) => {
  const path = window.location.pathname;
  const landingPagePath = routes.LandingPageRoute.to;
  const adminDashboardPath = routes.AdminRoute.to;
  const delegateDashboardPath = routes.DelegateRoute.to;

  const handleMobileMenuClick = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      <ul
        className={cn('flex flex-col gap-5 border-b border-stroke py-4 dark:border-strokedark', {
          'sm:px-6': path !== adminDashboardPath && path !== delegateDashboardPath,
          'px-6': path === adminDashboardPath || path.startsWith('/dashboard'),
        })}
      >
        {path === landingPagePath || path === adminDashboardPath ? (
          <li>
            <WaspRouterLink
              to={routes.DemoAppRoute.to}
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
            >
              <MdOutlineSpaceDashboard size='1.1rem' />
              AI Scheduler (Demo App)
            </WaspRouterLink>
          </li>
        ) : null}

        <li>
          <WaspRouterLink
            to={routes.DelegateRoute.to}
            onClick={handleMobileMenuClick}
            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
          >
            <MdOutlineSpaceDashboard size='1.1rem' />
            Wealth Management
          </WaspRouterLink>
        </li>
        
        <li>
          <WaspRouterLink
            to={routes.AccountRoute.to}
            onClick={handleMobileMenuClick}
            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
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
                d='M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z'
                fill=''
              />
              <path
                d='M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z'
                fill=''
              />
            </svg>
            Account Settings
          </WaspRouterLink>
        </li>
      </ul>
      {!!user && user.isAdmin && (
        <ul
          className={cn('flex flex-col gap-5 border-b border-stroke py-4 dark:border-strokedark', {
            'sm:px-6': path !== adminDashboardPath,
            'px-6': path === adminDashboardPath,
          })}
        >
          <li className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'>
            <WaspRouterLink
              to={routes.AdminRoute.to}
              onClick={handleMobileMenuClick}
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
            >
              <TfiDashboard size='1.1rem' />
              Admin Dashboard
            </WaspRouterLink>
          </li>
        </ul>
      )}
      <button
        onClick={() => logout()}
        className={cn(
          'flex items-center gap-3.5 py-4 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500',
          {
            'sm:px-6': path !== adminDashboardPath,
            'px-6': path === adminDashboardPath,
          }
        )}
      >
        <svg
          className='fill-current'
          width='18'
          height='18'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z'
            fill=''
          />
          <path
            d='M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z'
            fill=''
          />
        </svg>
        Log Out
      </button>
    </>
  );
};
