import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { Header } from './components/header'
import background from '@/assets/background.jpg'

export default function Layout({ children }) {
    return (<>
        <div
            className='bg-cover bg-center p-2 max-h-min w-full'
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset className={'bg-transparent'}>
                        <Header />
                        <main className={`p-2`}>
                            {children}
                        </main>
                </SidebarInset>

            </SidebarProvider>
        </div>
    </>)
}