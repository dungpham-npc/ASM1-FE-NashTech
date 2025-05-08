import { Input, Button, Badge, Menu, Dropdown, Avatar } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  BellOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  SettingOutlined,
  DashboardOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext} from "../../context/AuthContext.jsx";
import useCart from "../../hooks/useCart.js";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('productName') || '');
  const { logout, user, isAuthenticated, hasAnyRole } = useContext(AuthContext);
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);


  useEffect(() => {
    if (cart && cart.cartItems) {
      const uniqueItemsCount = cart.cartItems.length;
      setItemCount(uniqueItemsCount);
    } else {
      setItemCount(0);
    }
  }, [cart]);


  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    try {
      await logout(); // Await the async function
      window.dispatchEvent(new Event('authStateChanged'));
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still navigate even if logout fails
      navigate('/login');
    }
  };

  const handleCartClick = () => {
    navigate("/cart")
  };

  // Handle search submission
  const handleSearch = () => {
    // Preserve existing parameters except productName
    const newParams = new URLSearchParams(searchParams);

    if (searchTerm) {
      newParams.set('productName', searchTerm);
    } else {
      newParams.delete('productName');
    }

    // Reset to page 1 when searching
    newParams.set('page', '0');

    // Navigate to products page with search parameters
    navigate({
      pathname: '/',
      search: newParams.toString()
    });
  };

  // Check if user is admin or staff
  const isDashboardUser = isAuthenticated && hasAnyRole(['ADMIN']);

  // Account menu items for dropdown
  const getAccountMenuItems = () => {
    const items = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'My Profile',
        onClick: () => navigate('/profile'),
      },
    ];

    // Add dashboard link for admin and staff users
    if (isDashboardUser) {
      items.unshift({
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dashboard'),
      });
    }

    // Add other menu items
    items.push(
        // {
        //   key: 'orders',
        //   icon: <ShoppingOutlined />,
        //   label: 'My Orders',
        //   onClick: () => navigate('/account/orders'),
        // },
        // {
        //   key: 'preorders',
        //   icon: <HistoryOutlined />,
        //   label: 'My Preorders',
        //   onClick: () => navigate('/account/preorders'),
        // },
        // {
        //   key: 'payments',
        //   icon: <CreditCardOutlined />,
        //   label: 'Payment Methods',
        //   onClick: () => navigate('/account/payments'),
        // },
        // {
        //   key: 'settings',
        //   icon: <SettingOutlined />,
        //   label: 'Account Settings',
        //   onClick: () => navigate('/account/settings'),
        // },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogoutClick,
        }
    );

    return items;
  };

  const accountMenuItems = getAccountMenuItems();

  return (
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
                className="bg-red-600 px-3 py-1 cursor-pointer"
                onClick={() => window.location.href = '/'}
            >
              <span className="text-white font-bold text-lg">SHOPFUN</span>
            </div>
          </div>

          {/* Navigation Links */}
          <Menu mode="horizontal" className="hidden md:flex border-0">

            {/* Dashboard Link for Admin/Staff */}
            {isDashboardUser && (
                <Menu.Item key="dashboard" className="font-medium">
                  <a href="/dashboard">DASHBOARD</a>
                </Menu.Item>
            )}
          </Menu>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs mx-4">
            <Input
                placeholder="Search products..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="bg-gray-100 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
            />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Country Selector */}
            <div className="flex items-center bg-red-600 text-white px-2 py-1 rounded">
              <span className="text-xs font-bold">VN</span>
            </div>

            {/* Account - Conditionally render Sign in or Account dropdown */}
            {isAuthenticated ? (
                <Dropdown
                    menu={{ items: accountMenuItems }}
                    placement="bottomRight"
                    arrow
                >
                  <Button
                      type="text"
                      className="flex items-center"
                  >
                    <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        className="mr-1 bg-gray-200"
                    />
                    <span className="ml-1 text-sm hidden sm:inline">
                  {user && user.includes('ADMIN')
                      ? 'Admin'
                      : user && user.includes('STAFF')
                          ? 'Staff'
                          : 'My Account'}
                </span>
                    <DownOutlined className="ml-1 text-xs" />
                  </Button>
                </Dropdown>
            ) : (
                <Button
                    type="text"
                    icon={<UserOutlined />}
                    className="flex items-center"
                    onClick={handleSignInClick}
                >
                  <span className="ml-1 text-sm">Sign in / Register</span>
                </Button>
            )}

            {/* Cart with item count */}
            <Badge count={itemCount} size="small">
              <Button
                  type="text"
                  icon={<ShoppingOutlined />}
                  onClick={handleCartClick}
              />
            </Badge>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;