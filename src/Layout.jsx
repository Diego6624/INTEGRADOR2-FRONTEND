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
            className="md:hidden fixed top-5 left-4 sm:top-7 sm:left-6 z-50 flex size-10 items-center justify-center rounded-full
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
            <SidebarProvider defaultOpen={true} className="items-start gap-4 lg:gap-6">
                <FloatingSidebarToggle />

                <AppSidebar />
                <SidebarInset className="min-w-0 gap-5 bg-transparent sm:gap-6">
                    <Header />
                    <main className="min-w-0 w-full pb-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}