import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sprout } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/Input';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div>
      <Section variant="grid" className="py-16 md:py-20">
        <Container>
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
              Contact Engineering Team
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have technical questions regarding Dhara AI hardware specifications, LoRaWAN boundary
              integration, or farm deployment architecture? Reach out to our team.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="default" className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="p-6 sm:p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-6">
              {submitted ? (
                <div className="p-6 text-center space-y-4 font-sans">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Message Received</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Thank you for reaching out. This is a demonstration contact form. Our
                    engineering team will review your inquiry.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 text-xs"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-100">Engineering Inquiry Form</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name *"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="jane@farm.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Organization / Farm Name"
                      placeholder="Green Valley Farms"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                    <Input
                      label="Phone Number (Optional)"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <Textarea
                    label="Technical Message / Inquiry *"
                    placeholder="Describe your field pole density, crop types, or integration requirements..."
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-10 space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Demo Request</span>
                  </Button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-4">
                <h3 className="text-base font-bold text-slate-100">
                  System Architecture Enquiries
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dhara AI is currently in Phase 1 public architecture specification. For technical
                  inquiries regarding Phase 0 monorepo structure or upcoming Phase 2 tenant
                  features, contact our core architects.
                </p>

                <div className="space-y-3 font-mono text-xs text-slate-300 pt-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>engineering@dhara-ai.internal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sprout className="h-4 w-4 text-emerald-400" />
                    <span>Dhara AI Precision Agriculture Platform</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-dhara-slate text-xs font-mono text-slate-400 space-y-2">
                <div className="text-slate-200 font-bold font-sans">Verification Note</div>
                <p>
                  This form performs local validation only. Zero mock APIs or fake network requests
                  are made.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
