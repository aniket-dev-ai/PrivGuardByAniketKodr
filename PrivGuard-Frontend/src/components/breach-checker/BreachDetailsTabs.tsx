// src/components/breach-checker/BreachDetailsTabs.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PanelBottomClose, CalendarClock, KeyRound, Info, ChevronRight, Download } from "lucide-react";
import BreachDetailsTable from "./BreachDetailsTable";
import BreachTimeline from "./BreachTimeline";
import PasswordAnalysis from "./PasswordAnalysis";
import { BreachResponse } from "@/types/breach-types";
import { exportBreachReport } from "@/utiils/Pdfmaker";

interface BreachDetailsTabsProps {
    data: BreachResponse;
}

export default function BreachDetailsTabs({ data }: BreachDetailsTabsProps) {
    const [activeTab, setActiveTab] = useState("details");
    
    // Helper function to get the total number of exposed records
    const getTotalExposedRecords = () => {
        return data.ExposedBreaches.breaches_details.reduce(
            (total, breach) => total + breach.xposed_records, 0
        );
    };
    
    // Function to get the appropriate icon for a tab
    const getTabIcon = (tab: string) => {
        switch (tab) {
            case "details":
                return <PanelBottomClose className="h-4 w-4" />;
            case "timeline":
                return <CalendarClock className="h-4 w-4" />;
            case "passwords":
                return <KeyRound className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };
    
    // Function to get the appropriate title for the active tab
    const getActiveTabTitle = () => {
        switch (activeTab) {
            case "details":
                return "Security Breach Details";
            case "timeline":
                return "Breach History Timeline";
            case "passwords":
                return "Password Security Assessment";
            default:
                return "Breach Information";
        }
    };
    
    // Function to get the appropriate description for the active tab
    const getActiveTabDescription = () => {
        switch (activeTab) {
            case "details":
                return `Comprehensive breakdown of ${data.ExposedBreaches.breaches_details.length} breach incidents affecting ${getTotalExposedRecords().toLocaleString()} records`;
            case "timeline":
                return "Historical analysis of security incidents by year";
            case "passwords":
                return "Analysis of password storage security across breached services";
            default:
                return "Detailed breach information";
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader className="border-b pb-4">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                {getTabIcon(activeTab)}
                                <CardTitle className="text-xl font-medium">
                                    {getActiveTabTitle()}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {getActiveTabDescription()}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1" onClick={() => exportBreachReport(data)}>
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="border-b">
                    <TabsList className="flex w-full bg-transparent p-0">
                        <TabIndicator
                            value="details"
                            active={activeTab === "details"}
                            icon={<PanelBottomClose className="h-4 w-4" />}
                            label="Details"
                            onClick={() => setActiveTab("details")}
                        />
                        <TabIndicator
                            value="timeline"
                            active={activeTab === "timeline"}
                            icon={<CalendarClock className="h-4 w-4" />}
                            label="Timeline"
                            onClick={() => setActiveTab("timeline")}
                        />
                        <TabIndicator
                            value="passwords"
                            active={activeTab === "passwords"}
                            icon={<KeyRound className="h-4 w-4" />}
                            label="Passwords"
                            onClick={() => setActiveTab("passwords")}
                        />
                    </TabsList>
                </div>

                <TabsContent value="details" className="m-0 outline-none">
                    <BreachDetailsTable breaches={data.ExposedBreaches.breaches_details} />
                </TabsContent>

                <TabsContent value="timeline" className="m-0 outline-none">
                    <BreachTimeline yearwiseDetails={data.BreachMetrics.yearwise_details[0]} />
                </TabsContent>

                <TabsContent value="passwords" className="m-0 outline-none">
                    <PasswordAnalysis passwordStrength={data.BreachMetrics.passwords_strength[0]} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Custom Tab Indicator component for a more sophisticated tab appearance
interface TabIndicatorProps {
    value: string;
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

function TabIndicator({ value, active, icon, label, onClick }: TabIndicatorProps) {
    return (
        <TabsTrigger
            value={value}
            className={`
                flex items-center justify-center gap-1 flex-1 px-2 py-3 rounded-none border-b-2 transition-all text-sm
                ${active ? 
                    'border-primary text-primary font-medium' : 
                    'border-transparent text-muted-foreground hover:text-foreground'
                }
            `}
            onClick={onClick}
        >
            {icon}
            <span className="truncate">{label}</span>
            {active && <ChevronRight className="h-3 w-3 ml-0.5 hidden sm:inline" />}
        </TabsTrigger>
    );
}