import { useEffect } from 'react';

// imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css';
import LandingPage from './screens/LandingPage';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import ScrollToTop from "react-scroll-to-top";
import AOS from 'aos';
import 'aos/dist/aos.css'

// icons
import { ArrowUpward } from '@mui/icons-material';

// vendor
import VendorServices from './vendor/VendorServices';
import VendorformLayout from './vendor/VendorformLayout';
import VendorLogin from './vendor/VendorLogin';
import VendorEmailVerification from './vendorUtils/VendorEmailVerification';
import VendorPassword from './vendorUtils/VendorPassword';
import AddVenue from './vendor/AddVenue';
import VendorLayout from './vendor/VendorLayout';
import VendorDashboard from './vendor/VendorDashboard';
import AvailableDates from './vendor/AvailableDates';
import VendorSettings from './vendor/VendorSettings';
import ManageGallery from './vendor/ManageGallery';
import ManageContent from './vendor/ManageContent';

// rough
import Rough from './rough/Rough';
import Rough3 from './rough/Rough3';
import RoughFour from './rough/Rough4';
import Rough5 from './rough/Rough5';
import Rough2 from './rough/Rough2';

// user
import AboutUs from './screens/AboutUs';
import Blogs from './screens/Blogs';
import CheckoutLayout from './utils/CheckoutLayout';
import ProfilePage from './screens/profile/ProfilePage';
import ServiceDetailedPage from './screens/ServiceDetailedPage';
import ServiceListings from './utils/ServiceListings';
import SearchResults from './screens/SearchResults';
import BecomeVendor from './screens/BecomeVendor';
import FavoritesPage from './Favourites/FavoritesPage';
import TestimonialPage from './screens/TestimonialPage';

// protected
import LoginProtected from './protectedRoutes/LoginprotectedRoute';
import AdminProtected from './protectedRoutes/AdminProtected';
import VendorProtected from './vendor/VendorProtected';

// admin
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import UsersPage from './admin/UsersPage';
import RequestedServices from './admin/RequestedServices';
import ComposeMail from './admin/ComposeMail';
import InboxPage from './admin/InboxPage';
import ApprovedServices from './admin/ApprovedServices';
import DeclinedServices from './admin/DeclinedServices';
import DeleteService from './admin/DeleteService';
import AdminHome from './admin/AdminHome';

// context
import { FavoritesProvider } from './Favourites/FavoritesContext';
import { UserProvider } from './context/UserContext';
import EditService from './vendor/EditService';
import MessagesPage from './components/chat/MessagesPage';
import VendorMessagesPage from './vendor/chat/VendorMessagesPage';
import VendorConversationView from "./vendor/chat/VendorConversationView"
import NoConversationSelected from './vendor/chat/NoConversationSelected';
import ConversationView from './components/chat/ConversationView';
import LocationBasedServices from './screens/LocationServices';
import VendorsList from './admin/VendorsList';
import UsersList from './admin/UsersList';
import UserProfile from './admin/UserProfile';
import VendorProfile from './admin/VendorProfile';
import ContactPage from './screens/ContactPage';
import AutoScrollToTop from './components/AutoScrollToTop';
import CreateAdminUser from './admin/CreateAdminUser';
import AdminManagement from './admin/AdminManagement';
import ApprovalLogs from './admin/ApprovalLogs';
import ManageUsers from './admin/ManageUsers';
import OrdersPage from './vendor/OrdersPage';
import ProfileLayout from './screens/profile/ProfileLayout';
import EmailandPassword from './screens/profile/EmailandPassword';
import UserNotifications from './screens/profile/Notifications';
import Bookings from './screens/profile/Bookings';
import NotificationsPage from './vendor/NotificationsPage';
import PaymentHistory from './screens/profile/PaymentHistory';
// import { ThemeProviderWrapper } from './Themes/ThemeContext';


const App = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 120,
    });

    AOS.refresh();
  }, []);

  // login protected route wrapper
  const userProtected = (element) => {
    return <LoginProtected>{element}</LoginProtected>;
  };

  // admin protected route wrapper
  // const adminProtection = (element) => {
  //   return (
  //     <AdminProtected>
  //       {element}
  //     </AdminProtected>
  //   );
  // };

  const adminProtection = (Component, permission) => (
    <AdminProtected requiredPermission={permission}>
      <Component />
    </AdminProtected>
  );

  return (
    <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>

      <UserProvider>
        <FavoritesProvider>

          <ScrollToTop
            smooth
            style={{ borderRadius: 50, }}
            component={<ArrowUpward sx={{ fontSize: 18, color: "#6f00ff", }} />}
          />

          {/* <ThemeProviderWrapper> */}
          <BrowserRouter >

            <AutoScrollToTop />

            <Routes >

              {/* client */}
              <Route path='/' element={<LandingPage />}></Route>
              <Route path='/contact' element={<ContactPage />}></Route>
              <Route path='/about' element={<AboutUs />}></Route>
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/testimonials" element={<TestimonialPage />} />

              <Route path="/profile" element={userProtected(<ProfileLayout />)}>
                <Route index element={<ProfilePage />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="payments" element={<PaymentHistory />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="emails-&-password" element={<EmailandPassword />} />
                <Route path="notifications" element={<UserNotifications />} />
              </Route>


              <Route path="/category/:service/:serviceId" element={<ServiceDetailedPage />} />
              <Route path="/service/:service" element={<ServiceListings />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/checkout/:venueId" element={<CheckoutLayout />} />
              <Route path="/become-a-vendor" element={<BecomeVendor />} />

              {/* messages */}
              <Route path="messages/*" element={userProtected(<MessagesPage />)} >
                <Route index element={<NoConversationSelected />} />
                <Route path=":conversationId" element={<ConversationView />} />
              </Route>

              {/* location based services */}
              <Route path="/services" element={<LocationBasedServices />} />

              {/* vendor login */}
              <Route path="vendor-login" element={<VendorLogin />} />
              <Route path="vendor/verify/:token" element={<VendorEmailVerification />} />
              <Route path="vendor/password_setup" element={<VendorPassword />} />

              {/* vendor */}
              <Route path="vendor-dashboard" element={<VendorProtected><VendorLayout /></VendorProtected>}>
                <Route index element={<VendorDashboard />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="vendor-services" element={<VendorServices />} />
                <Route path="vendor-services/:profileForm" element={<VendorformLayout />} />
                <Route path="settings" element={<VendorSettings />} />
                <Route path="manage-gallery" element={<ManageGallery />} />
                <Route path="manage-services" element={<ManageContent />} />
                <Route path="available-dates" element={<AvailableDates />} />
                <Route path="edit/:service/:serviceId" element={<EditService />} />

                <Route path="messages/*" element={<VendorMessagesPage />} >
                  <Route index element={<NoConversationSelected />} />
                  <Route path=":conversationId" element={<VendorConversationView />} />
                </Route>
              </Route>


              {/* admin */}
              <Route path="admin-login" element={<AdminLogin />} />
              <Route path="admin-dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>}>
                <Route index element={adminProtection(AdminHome, "dashboard")} />

                <Route path="inbox" element={adminProtection(InboxPage, "view_inbox")} />
                <Route path="compose" element={adminProtection(ComposeMail, "compose_mail")} />

                <Route path="requests" element={adminProtection(RequestedServices, "view_requests")} />
                <Route path="requests/approved" element={adminProtection(ApprovedServices, "view_approved_requests")} />
                <Route path="requests/declined" element={adminProtection(DeclinedServices, "view_declined_requests")} />
                <Route path="requests/delete" element={adminProtection(DeleteService, "delete_requests")} />

                <Route path="list/vendors" element={adminProtection(VendorsList, "view_vendors")} />
                <Route path="list/users" element={adminProtection(UsersList, "view_users")} />

                <Route path="users/:id" element={adminProtection(UserProfile, "view_user_profile")} />
                <Route path="vendors/:id" element={adminProtection(VendorProfile, "view_vendor_profile")} />

                <Route path="create-user" element={adminProtection(CreateAdminUser, "create_user")} />

                <Route path="admin-users" element={adminProtection(AdminManagement, "admin_users")} />

                <Route path="approval-logs" element={adminProtection(ApprovalLogs, "approval_logs")} />
                <Route path="manage-users" element={adminProtection(ManageUsers, "manage_users")} />


              </Route>



              {/* <Route path="admin-users" element={adminProtection(<UsersPage />)} /> */}

              <Route path='111' element={<Rough />}></Route>
              <Route path='222' element={<Rough2 />}></Route>
              <Route path='333' element={<Rough3 />}></Route>
              <Route path='444' element={<RoughFour />}></Route>
              <Route path='555' element={<Rough5 />}></Route>

            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </UserProvider>


      {/* </ThemeProviderWrapper> */}
    </GoogleOAuthProvider >

  );
}

export default App;
