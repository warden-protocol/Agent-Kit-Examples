import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, User } from "lucide-react";

export default function GameInfo() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Current Turn
        </h2>
        <Badge variant="secondary" className="text-lg py-2">
          White to move
        </Badge>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Players
        </h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">White</p>
            <p className="font-mono text-sm break-all">
              0x1234...5678
            </p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Black</p>
            <p className="font-mono text-sm break-all">
              0x8765...4321
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
