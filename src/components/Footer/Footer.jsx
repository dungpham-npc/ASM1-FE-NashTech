import { Input, Button, Row, Col, Space } from 'antd';
import { 
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  PinterestOutlined,
  TikTokOutlined
} from '@ant-design/icons';
import './Footer.css';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import paypalLogo from '../../assets/paypal.png';

export const Footer = () => {
  return (
    <footer>
      {/* Copyright and Payment Methods */}
      <div className="bg-black border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 mb-4">© 2025 SHOPFUN ALL RIGHTS RESERVED</p>
            <Space size={16} className="justify-center">
            <img src={visaLogo} alt="Visa" className="h-6" />
            <img src={mastercardLogo} alt="Mastercard" className="h-6" />
            <img src={paypalLogo} alt="PayPal" className="h-6" />
            </Space>
          </div>
        </div>
      </div>
    </footer>
  );
};
