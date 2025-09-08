import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, RefreshCw, Clock, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useLogger from '@/hooks/useLogger';

interface GenerationResult {
  output: string;
  timestamp: string;
  model: string;
  prompt: string;
  length: number;
}

interface OutputDisplayProps {
  result: GenerationResult | null;
  isGenerating: boolean;
  onRegenerate?: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isGenerating, onRegenerate }) => {
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();
  const { logEvent } = useLogger();

  const handleCopy = async () => {
    if (!result?.output) return;
    
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(result.output);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
      
      logEvent({
        stack: 'frontend',
        level: 'info',
        package: 'OutputDisplay',
        message: 'User copied generated content to clipboard'
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard",
      });
      
      logEvent({
        stack: 'frontend',
        level: 'error',
        package: 'OutputDisplay',
        message: `Copy to clipboard failed: ${error}`
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownload = () => {
    if (!result?.output) return;
    
    const blob = new Blob([result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logEvent({
      stack: 'frontend',
      level: 'info',
      package: 'OutputDisplay',
      message: 'User downloaded generated content'
    });
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Generating amazing content...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center h-40 flex items-center justify-center">
            <p className="text-muted-foreground">Generated content will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Generated Content</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {result.model}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(result.timestamp).toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {result.output}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {result.output.split(' ').length} words • Generated from: "{result.prompt.substring(0, 50)}..."
          </div>
          
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              disabled={isCopying}
            >
              <Copy className="h-4 w-4 mr-2" />
              {isCopying ? 'Copying...' : 'Copy'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputDisplay;