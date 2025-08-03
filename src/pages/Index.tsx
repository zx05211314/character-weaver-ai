import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Character {
  id: string;
  name: string;
  summary: string;
  battle_skill: number;
  magic_skill: number;
  charm_skill: number;
  research_skill: number;
  life_skill: number;
  appearance_count: number;
}

interface Novel {
  id: string;
  title: string;
  url: string;
  status: string;
}

const Index = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "請輸入網址",
        description: "請提供小說的網址以進行分析",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);

    try {
      // Create novel record
      const { data: novelData, error: novelError } = await supabase
        .from("novels")
        .insert({
          title: "分析中...",
          url: url.trim(),
          status: "pending"
        })
        .select()
        .single();

      if (novelError) throw novelError;

      setNovel(novelData);
      setProgress(30);

      toast({
        title: "開始分析",
        description: "正在分析小說內容，請稍候...",
      });

      // TODO: Call edge function to crawl and analyze
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(100);

      // Mock characters data
      const mockCharacters = [
        {
          id: "1",
          name: "主角",
          summary: "故事的主要角色，擁有強大的戰鬥能力",
          battle_skill: 85,
          magic_skill: 70,
          charm_skill: 60,
          research_skill: 45,
          life_skill: 55,
          appearance_count: 156
        },
        {
          id: "2", 
          name: "女主角",
          summary: "智慧型角色，精通魔法和研究",
          battle_skill: 40,
          magic_skill: 95,
          charm_skill: 80,
          research_skill: 90,
          life_skill: 70,
          appearance_count: 98
        }
      ];

      setCharacters(mockCharacters);

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "分析失敗",
        description: "無法分析該小說，請檢查網址是否正確",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSkillColor = (skill: number) => {
    if (skill >= 80) return "bg-red-500";
    if (skill >= 60) return "bg-orange-500";
    if (skill >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">小說角色分析器</h1>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground">AI 智能分析小說角色能力與特徵</p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              開始分析
            </CardTitle>
            <CardDescription>
              輸入小說網址，AI 將自動抓取內容並分析角色特徵
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="https://example.com/novel"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="px-8"
              >
                {isAnalyzing ? "分析中..." : "開始分析"}
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  正在處理小說內容...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {characters.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">角色分析結果</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <Card key={character.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{character.name}</CardTitle>
                    <CardDescription>{character.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">戰鬥技能</span>
                        <span className="text-sm text-muted-foreground">{character.battle_skill}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(character.battle_skill)}`}
                          style={{ width: `${character.battle_skill}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">魔法能力</span>
                        <span className="text-sm text-muted-foreground">{character.magic_skill}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(character.magic_skill)}`}
                          style={{ width: `${character.magic_skill}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">魅力值</span>
                        <span className="text-sm text-muted-foreground">{character.charm_skill}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(character.charm_skill)}`}
                          style={{ width: `${character.charm_skill}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">研究能力</span>
                        <span className="text-sm text-muted-foreground">{character.research_skill}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(character.research_skill)}`}
                          style={{ width: `${character.research_skill}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">生活技能</span>
                        <span className="text-sm text-muted-foreground">{character.life_skill}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getSkillColor(character.life_skill)}`}
                          style={{ width: `${character.life_skill}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        出現次數: {character.appearance_count} 次
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;