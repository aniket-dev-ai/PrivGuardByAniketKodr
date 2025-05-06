import AppRouter from "@/routes/AppRouter"
import {Toaster} from "@/components/ui/sonner"

const App = () => {
  return (
    <>
    <AppRouter/>
    <Toaster position="bottom-right" richColors closeButton />
    </>
  )
}

export default App