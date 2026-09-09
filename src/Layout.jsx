import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { Header } from './components/header'
import background from '@/assets/background.jpg'
import { Menu } from 'lucide-react';

function FloatingSidebarToggle() {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Abrir menú"
            className="md:hidden fixed top-7 left-3 z-50 flex size-10 items-center justify-center rounded-full
                border border-white/10 bg-blue-500 backdrop-blur-md transition hover:bg-gray-600 cursor-pointer"
        >
            <Menu className="size-5" />
        </button>
    );
}

export default function Layout({ children }) {
    return (
        <div
            className="bg-cover bg-center bg-fixed min-h-screen w-full p-2 sm:p-4"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <SidebarProvider defaultOpen={true}>
                <FloatingSidebarToggle />

                <AppSidebar />
                <SidebarInset className={'bg-transparent'}>
                    <Header />
                    <main className={`p-2 pt-4`}>
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}