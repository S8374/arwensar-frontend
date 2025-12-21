import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Shield, TrendingUp } from "lucide-react";

export default function ReportsStatsCards() {
   return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Suppliers</p>
                                    <p className="text-3xl font-bold mt-2">156</p>
                                    <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Shield className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Assessments</p>
                                    <p className="text-3xl font-bold mt-2">48</p>
                                    <p className="text-xs text-muted-foreground mt-1">6 new this month</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <BarChart3 className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                                    <p className="text-3xl font-bold mt-2">12</p>
                                    <p className="text-xs text-amber-600 mt-1">3 overdue</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <TrendingUp className="w-8 h-8 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> 
    </div>
   )
}