import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { Header } from './components/header'
import background from '@/assets/background.jpg'

export default function Layout({ children }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className={'mt-4'}>
                

                <Header />
                <main className={`flex-1 p-6 bg-cover`}
                style={{
                    backgroundImage: `url(${background})`,
                }}
                >
                    {children}
                </main>

                <SidebarTrigger/>
            </SidebarInset>
        </SidebarProvider>
    )
}