-- Create table for novels
CREATE TABLE public.novels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending', -- pending, crawling, analyzing, completed, error
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for characters
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary TEXT,
  battle_skill INTEGER DEFAULT 0 CHECK (battle_skill >= 0 AND battle_skill <= 100),
  magic_skill INTEGER DEFAULT 0 CHECK (magic_skill >= 0 AND magic_skill <= 100),
  charm_skill INTEGER DEFAULT 0 CHECK (charm_skill >= 0 AND charm_skill <= 100),
  research_skill INTEGER DEFAULT 0 CHECK (research_skill >= 0 AND research_skill <= 100),
  life_skill INTEGER DEFAULT 0 CHECK (life_skill >= 0 AND life_skill <= 100),
  appearance_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app)
CREATE POLICY "Anyone can view novels" 
ON public.novels 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create novels" 
ON public.novels 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update novels" 
ON public.novels 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view characters" 
ON public.characters 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create characters" 
ON public.characters 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update characters" 
ON public.characters 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_novels_updated_at
  BEFORE UPDATE ON public.novels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();