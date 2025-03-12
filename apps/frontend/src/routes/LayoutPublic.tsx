import background from '@/assets/login_background.jpg';
import { Outlet } from '@tanstack/react-router';

const LayoutPublic = () => {
    return (
        <div className="grid w-full h-[100vh] grid-cols-1 bg-white box-anim md:grid-cols-4">
            <Outlet />
            <div className="hidden md:block md:col-span-2 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${background})` }}>
                <p className="mt-10 text-xs text-slate-200 absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    BookIt LLC {(new Date()).getFullYear()} All rights reserved
                </p>
            </div>
        </div>
    );
};

export default LayoutPublic;