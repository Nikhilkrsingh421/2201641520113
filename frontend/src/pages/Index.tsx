import React, { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import OutputDisplay from '@/components/OutputDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, History, Settings } from 'lucide-react';
import useLogger from '@/hooks/useLogger';

interface GenerationResult {
  output: string;
  timestamp: string;
  model: string;
  prompt: string;
  length: number;
}

const Index = () => {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const { logEvent } = useLogger();

  // Simulate AI generation (in real app, this would call backend API)
  const generateContent = async (prompt: string, model: string, length: number) => {
    setIsGenerating(true);
    
    logEvent({
      stack: 'frontend',
      level: 'info',
      package: 'Index',
      message: `Starting AI generation with model: ${model}`
    });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Generate sample content (in real app, this would be from AI API)
      const sampleOutputs = [
        `Based on your prompt "${prompt}", here's a creative response:\n\nArtificial Intelligence represents one of humanity's greatest achievements, offering unprecedented opportunities to solve complex problems and enhance our daily lives. From healthcare diagnostics to creative writing assistance, AI technologies are transforming how we work, learn, and interact with the world around us.\n\nThe key to successful AI implementation lies in maintaining a balance between automation and human creativity, ensuring that technology serves to amplify our capabilities rather than replace our unique human insights.`,
        
        `Your prompt "${prompt}" inspired this thoughtful exploration:\n\nIn the rapidly evolving landscape of artificial intelligence, we find ourselves at a remarkable crossroads where innovation meets responsibility. AI systems are becoming increasingly sophisticated, capable of understanding context, generating creative content, and solving problems that once seemed insurmountable.\n\nThe future of AI lies not just in its technical capabilities, but in how we choose to integrate these tools into our society, ensuring they enhance human potential while preserving the qualities that make us uniquely human.`,
        
        `Reflecting on "${prompt}", here's an insightful perspective:\n\nThe relationship between humans and artificial intelligence is evolving into a powerful partnership. Rather than viewing AI as a replacement for human intelligence, we can embrace it as a complement to our natural abilities.\n\nThis collaboration opens new possibilities for creativity, problem-solving, and innovation that neither humans nor AI could achieve alone. The key is to maintain human oversight and values while leveraging AI's computational power and pattern recognition capabilities.`
      ];
      
      const output = sampleOutputs[Math.floor(Math.random() * sampleOutputs.length)];
      
      const newResult: GenerationResult = {
        output: output.substring(0, length * 5), // Approximate word count
        timestamp: new Date().toISOString(),
        model,
        prompt,
        length
      };
      
      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10
      
      logEvent({
        stack: 'frontend',
        level: 'info',
        package: 'Index',
        message: `AI generation completed successfully. Output length: ${newResult.output.length} characters`
      });
      
    } catch (error) {
      logEvent({
        stack: 'frontend',
        level: 'error',
        package: 'Index',
        message: `AI generation failed: ${error}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (result) {
      generateContent(result.prompt, result.model, result.length);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Loveable AI Generator</h1>
                <p className="text-sm text-muted-foreground">Generate amazing content with AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History ({history.length})
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <PromptInput onGenerate={generateContent} isGenerating={isGenerating} />
        <OutputDisplay 
          result={result} 
          isGenerating={isGenerating} 
          onRegenerate={handleRegenerate}
        />
        
        {/* History Section */}
        {history.length > 0 && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Generations</h3>
              <div className="space-y-3">
                {history.slice(0, 3).map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setResult(item)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {item.prompt.substring(0, 50)}...
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.output.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
