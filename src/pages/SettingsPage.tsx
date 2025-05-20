
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { status, resetProgress, exportData, importData, updateDailyGoal } = useVocabulary();
  const { toast } = useToast();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(status.dailyGoal);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  const handleResetProgress = () => {
    resetProgress();
    setConfirmResetOpen(false);
    toast({
      title: t('common.success'),
      description: t('settings.resetComplete'),
    });
  };
  
  const handleExportData = () => {
    const data = exportData();
    
    // Create a blob and trigger download
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ielts-vocab-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('common.success'),
      description: t('settings.dataExported'),
    });
  };
  
  const handleImportData = () => {
    if (!importFile) {
      toast({
        title: t('common.error'),
        description: t('settings.noFileSelected'),
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const success = importData(data);
        
        if (success) {
          toast({
            title: t('common.success'),
            description: t('settings.dataImported'),
          });
        } else {
          toast({
            title: t('common.error'),
            description: t('settings.invalidData'),
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('settings.importFailed'),
          variant: 'destructive',
        });
      }
    };
    
    reader.readAsText(importFile);
  };
  
  const handleDailyGoalChange = (value: number[]) => {
    const newGoal = value[0];
    setDailyGoal(newGoal);
  };
  
  const handleSaveDailyGoal = () => {
    updateDailyGoal(dailyGoal);
    toast({
      title: t('common.success'),
      description: t('settings.goalUpdated'),
    });
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.appearance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="language">{t('settings.language')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.languageDescription')}</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button 
                  variant={language === 'zh' ? 'default' : 'outline'}
                  onClick={() => setLanguage('zh')}
                >
                  中文
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">{t('settings.theme')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.themeDescription')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="theme-toggle">{theme === 'dark' ? t('settings.dark') : t('settings.light')}</Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.study')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">{t('settings.notifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.notificationsDescription')}</p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="daily-goal">{t('settings.dailyGoal')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.dailyGoalDescription')}</p>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="daily-goal"
                  defaultValue={[status.dailyGoal]}
                  min={1}
                  max={50}
                  step={1}
                  value={[dailyGoal]}
                  onValueChange={handleDailyGoalChange}
                  className="w-full"
                />
                <span className="font-bold min-w-[3ch]">{dailyGoal}</span>
              </div>
              <Button onClick={handleSaveDailyGoal} size="sm" variant="outline">
                {t('common.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.data')}</CardTitle>
            <CardDescription>{t('settings.dataDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Button variant="outline" onClick={handleExportData}>
                {t('settings.exportData')}
              </Button>
              
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
                <Button 
                  variant="outline" 
                  onClick={handleImportData}
                  disabled={!importFile}
                >
                  {t('settings.importData')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.danger')}</CardTitle>
            <CardDescription>{t('settings.dangerDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive"
              onClick={() => setConfirmResetOpen(true)}
            >
              {t('settings.resetProgress')}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirm')}</DialogTitle>
            <DialogDescription>
              {t('settings.resetConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmResetOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleResetProgress}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
