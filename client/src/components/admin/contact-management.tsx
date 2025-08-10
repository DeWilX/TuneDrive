import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Clock, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Schema for global contact info
const globalContactInfoSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  email: z.string().email("Valid email is required"),
  location: z.string().min(1, "Location is required"),
  workingHours: z.string().min(1, "Working hours are required"),
  quotesEmail: z.string().email("Valid quotes email is required"),
});

// Schema for contact page content
const contactPageContentSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
  formTitle: z.string().min(1, "Form title is required"),
  formDescription: z.string().min(1, "Form description is required"),
});

type GlobalContactInfo = z.infer<typeof globalContactInfoSchema>;
type ContactPageContent = z.infer<typeof contactPageContentSchema>;

export function ContactManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch global contact info
  const { data: globalContactInfo, isLoading: isLoadingGlobal } = useQuery({
    queryKey: ["/api/admin/global-contact-info"],
  });

  // Fetch contact page content
  const { data: contactPageContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/admin/contact-page-content"],
  });

  // Global contact info form
  const globalForm = useForm<GlobalContactInfo>({
    resolver: zodResolver(globalContactInfoSchema),
    defaultValues: {
      phone: "+371 123 456 789",
      whatsapp: "+371 123 456 789",
      email: "info@chiptuningpro.lv",
      location: "Riga, Latvia",
      workingHours: "Mon-Fri: 9:00-18:00",
      quotesEmail: "quotes@chiptuningpro.lv",
    },
  });

  // Contact page content form
  const contentForm = useForm<ContactPageContent>({
    resolver: zodResolver(contactPageContentSchema),
    defaultValues: {
      heroTitle: "Get Your Custom ECU Tune",
      heroDescription: "Ready to unlock your engine potential? Contact our experts for a personalized quote.",
      formTitle: "Request Your Quote",
      formDescription: "Fill out the form below and we will get back to you within 24 hours with a customized quote.",
    },
  });

  // Update forms when data loads
  useEffect(() => {
    if (globalContactInfo) {
      globalForm.reset(globalContactInfo);
    }
  }, [globalContactInfo, globalForm]);

  useEffect(() => {
    if (contactPageContent) {
      contentForm.reset(contactPageContent);
    }
  }, [contactPageContent, contentForm]);

  // Mutation for updating global contact info
  const updateGlobalMutation = useMutation({
    mutationFn: (data: GlobalContactInfo) =>
      apiRequest("/api/admin/global-contact-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Global contact information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/global-contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/global-contact-info"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update global contact information",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating contact page content
  const updateContentMutation = useMutation({
    mutationFn: (data: ContactPageContent) =>
      apiRequest("/api/admin/contact-page-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact page content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-page-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-page-content"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact page content",
        variant: "destructive",
      });
    },
  });

  const onGlobalSubmit = (data: GlobalContactInfo) => {
    updateGlobalMutation.mutate(data);
  };

  const onContentSubmit = (data: ContactPageContent) => {
    updateContentMutation.mutate(data);
  };

  if (isLoadingGlobal || isLoadingContent) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <p className="text-muted-foreground">
          Manage global contact information and contact page content
        </p>
      </div>

      <Tabs defaultValue="global-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global-info" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Global Contact Info
          </TabsTrigger>
          <TabsTrigger value="page-content" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Page Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global-info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Contact Information
              </CardTitle>
              <CardDescription>
                Centralized contact information displayed across the entire website. 
                This information will appear consistently in the header, footer, and contact sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...globalForm}>
                <form onSubmit={globalForm.handleSubmit(onGlobalSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={globalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+371 123 456 789" {...field} />
                          </FormControl>
                          <FormDescription>
                            Main phone number displayed across the site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={globalForm.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            WhatsApp Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+371 123 456 789" {...field} />
                          </FormControl>
                          <FormDescription>
                            WhatsApp number for direct messaging
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={globalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Main Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@chiptuningpro.lv" {...field} />
                          </FormControl>
                          <FormDescription>
                            Main contact email displayed on the site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={globalForm.control}
                      name="quotesEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Quotes Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="quotes@chiptuningpro.lv" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email where quote requests from contact form will be sent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={globalForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Riga, Latvia" {...field} />
                          </FormControl>
                          <FormDescription>
                            Business location displayed on the site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={globalForm.control}
                      name="workingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Working Hours
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Mon-Fri: 9:00-18:00" {...field} />
                          </FormControl>
                          <FormDescription>
                            Business hours displayed on the site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateGlobalMutation.isPending}
                  >
                    {updateGlobalMutation.isPending ? "Updating..." : "Update Global Contact Info"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Page Content
              </CardTitle>
              <CardDescription>
                Content specific to the contact page including hero section and form descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...contentForm}>
                <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-6">
                  <FormField
                    control={contentForm.control}
                    name="heroTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Get Your Custom ECU Tune" {...field} />
                        </FormControl>
                        <FormDescription>
                          Main title displayed at the top of the contact page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="heroDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ready to unlock your engine potential? Contact our experts for a personalized quote."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Description text displayed below the hero title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="formTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Request Your Quote" {...field} />
                        </FormControl>
                        <FormDescription>
                          Title displayed above the contact form
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="formDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Fill out the form below and we will get back to you within 24 hours with a customized quote."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Description text displayed above the contact form
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateContentMutation.isPending}
                  >
                    {updateContentMutation.isPending ? "Updating..." : "Update Contact Page Content"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}