import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Wand2, Sparkles } from 'lucide-react';
import useLogger from '@/hooks/useLogger';

interface PromptInputProps {
  onGenerate: (prompt: string, model: string, length: number) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [length, setLength] = useState([100]);
  const { logEvent } = useLogger();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    logEvent({
      stack: 'frontend',
      level: 'info',
      package: 'PromptInput',
      message: `User submitted prompt: "${prompt.substring(0, 50)}..." with model: ${model}, length: ${length[0]}`
    });
    
    onGenerate(prompt, model, length[0]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Prompt
            </label>
            <Textarea
              placeholder="Write a creative story about AI helping humanity..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                AI Model
              </label>
              <Select value={model} onValueChange={setModel} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Max Length: {length[0]} words
              </label>
              <Slider
                value={length}
                onValueChange={setLength}
                max={500}
                min={50}
                step={25}
                className="w-full"
                disabled={isGenerating}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptInput;