import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface HelpSection {
  title: string;
  icon: string;
  content: string[];
  tips?: string[];
}

const helpSections: HelpSection[] = [
  {
    title: "Getting Started",
    icon: "fas fa-play",
    content: [
      "Welcome to your website control panel! This is where you manage all your chiptuning website content.",
      "Start by clicking on the tabs above to explore different sections.",
      "Changes you make here appear immediately on your live website."
    ],
    tips: [
      "Always preview your changes by clicking 'View Site' button",
      "Save your work regularly - changes are saved automatically",
      "Use simple, clear language that your customers will understand"
    ]
  },
  {
    title: "Managing Services",
    icon: "fas fa-cogs",
    content: [
      "Add your tuning services with clear names like 'Stage 1 Tuning' or 'DPF Removal'.",
      "Include competitive pricing that shows on your website.",
      "List benefits customers care about - power gains, fuel savings, etc."
    ],
    tips: [
      "Keep descriptions short and easy to read",
      "Use bullet points for features - each line becomes a bullet",
      "Test different prices to see what works best"
    ]
  },
  {
    title: "Vehicle Database",
    icon: "fas fa-car",
    content: [
      "Add vehicles with original power specs and tuning potential.",
      "Organize by brand, model, and engine variant.",
      "Include realistic power gains customers can expect."
    ],
    tips: [
      "Be accurate with power figures - it builds trust",
      "Add popular car models in your area first",
      "Update regularly with new vehicles"
    ]
  },
  {
    title: "Website Content",
    icon: "fas fa-edit",
    content: [
      "Edit your homepage content, headlines, and about section.",
      "Change images and text to match your business.",
      "Keep content fresh and up-to-date."
    ],
    tips: [
      "Use high-quality images of your work",
      "Write in your own voice - be authentic",
      "Focus on benefits customers will get"
    ]
  }
];

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <i className="fas fa-question text-lg"></i>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <Card className="bg-gray-800 border-gray-700 shadow-2xl max-h-96 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <i className="fas fa-question-circle text-blue-400"></i>
            Help & Tips
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {helpSections.map((section) => (
            <Collapsible key={section.title}>
              <CollapsibleTrigger
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className={`${section.icon} text-accent-400`}></i>
                  <span className="font-medium text-gray-100">{section.title}</span>
                </div>
                <i className={`fas fa-chevron-${openSections.includes(section.title) ? 'up' : 'down'} text-gray-400`}></i>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 bg-gray-700/50 rounded-lg">
                <div className="space-y-2 text-sm">
                  {section.content.map((text, idx) => (
                    <p key={idx} className="text-gray-300">{text}</p>
                  ))}
                  {section.tips && (
                    <div className="mt-3 pt-2 border-t border-gray-600">
                      <p className="text-blue-300 font-medium mb-1">💡 Pro Tips:</p>
                      {section.tips.map((tip, idx) => (
                        <p key={idx} className="text-gray-400 text-xs">• {tip}</p>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}