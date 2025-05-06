// SecurityTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasskeyManagementTab from "./tabs/PasskeyManagementTab";
import SecurityStatusCardTab from "./tabs/SecurityStatusCardTab";


const SecurityTabs = () => {
    return (
        <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid grid-cols-2 mx-auto mb-6 w-full max-w-md">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
            </TabsList>

            <TabsContent value="status">
                <SecurityStatusCardTab />
            </TabsContent>

            <TabsContent value="passkeys">
                <PasskeyManagementTab />
            </TabsContent>

        </Tabs>
    );
};

export default SecurityTabs;





