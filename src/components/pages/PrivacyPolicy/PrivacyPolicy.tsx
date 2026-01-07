/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/PrivacyPolicy.tsx

import { Shield, Lock, Server, Mail, FileLock, CheckCircle2, AlertCircle, User, Activity, Package2Icon, TargetIcon, FileText, Calendar1 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At CyberNark, we are committed to protecting your privacy and ensuring the highest standards of data security in compliance with GDPR and NIS2 Directive.
          </p>
          <Badge className="mt-6 text-lg px-6 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Last Updated: January 2026
          </Badge>
        </div>

        {/* Introduction Card */}
        <Card className="mb-12 shadow-lg border-0">
          <CardContent className="pt-10 pb-12 px-10">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  CyberNark values privacy and data protection as core principles of its platform. We understand that organizations operating under <strong>NIS2</strong> and <strong>GDPR</strong> must demonstrate transparency, accountability, and security in how personal and sensitive information is handled.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  This Privacy Policy explains in detail how CyberNark collects, processes, stores, protects, and, where applicable, shares personal data when users access our website or use our Software-as-a-Service platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Controller */}
        <Card className="mb-12 shadow-lg border-0">
          <CardContent className="pt-10 pb-12 px-10">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Server className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-semibold mb-4">2. Identity of the Data Controller</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  CyberNark acts as the <strong>data controller</strong> for personal data processed in relation to our website and platform operations.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  For supplier-related data uploaded by customers (such as questionnaires, certifications, policies, and contracts), CyberNark acts as a <strong>data processor</strong> and processes such data solely on documented instructions from its customers (the data controllers).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories of Personal Data */}
        <Card className="mb-12 shadow-lg border-0">
          <CardContent className="pt-10 pb-12 px-10">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FileLock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-semibold mb-6">3. Categories of Personal Data</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Account & Identification
                    </h3>
                    <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Name and role</li>
                      <li>Business email address</li>
                      <li>Organization name</li>
                      <li>Authentication credentials</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-600" />
                      Usage & Technical Data
                    </h3>
                    <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                      <li>IP addresses</li>
                      <li>Timestamps and logs</li>
                      <li>Device and browser information</li>
                      <li>Platform interaction data</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Package2Icon className="w-5 h-5 text-purple-600" />
                      Supplier & Third-Party Data
                    </h3>
                    <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Uploaded questionnaires</li>
                      <li>Certifications and policies</li>
                      <li>Contracts and evidence documents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purposes & Legal Basis */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-10 pb-12 px-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <TargetIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold mb-6">4. Purposes of Processing</h2>
                  <ul className="space-y-4 text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>To provide, operate, and maintain the CyberNark platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>To enable supplier onboarding, assessments, risk scoring, alerts, and reporting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>To ensure system security, integrity, availability, and compliance with legal obligations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-10 pb-12 px-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                  <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold mb-6">5. Legal Basis for Processing</h2>
                  <ul className="space-y-4 text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Contractual necessity</strong> – to deliver the agreed services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Legitimate interests</strong> – platform security and service improvement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Legal obligations</strong> – compliance with GDPR and NIS2 requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Retention */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-10 pb-12 px-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold mb-6">6. Data Security and Safeguards</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    CyberNark implements robust technical and organizational measures to protect your data.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /> Encryption in transit and at rest</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /> Role-based access controls</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /> Secure multi-factor authentication</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /> Comprehensive audit logging</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /> Continuous security monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-10 pb-12 px-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Calendar1 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold mb-6">7. Data Retention</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected, including legal and contractual obligations.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                    Upon termination of the customer relationship, data will be securely deleted or anonymized in accordance with applicable requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Subject Rights */}
        <Card className="mb-16 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="pt-12 pb-14 px-10">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-xl">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-semibold mb-6 text-blue-900 dark:text-blue-300">
                  8. Your Data Subject Rights
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Under GDPR, you have the right to:
                </p>
                <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Access your personal data</li>
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Rectify inaccurate data</li>
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Request erasure ("right to be forgotten")</li>
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Restrict or object to processing</li>
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Data portability</li>
                  <li className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /> Lodge a complaint with a supervisory authority</li>
                </ul>
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl text-center shadow-inner">
                  <p className="text-lg font-medium mb-3">To exercise your rights, please contact us at:</p>
                  <a href="mailto:info@cybernark.com" className="flex justify-center gap-3 text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    <Mail className="w-6 h-6" />
                    info@cybernark.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-4">
                    We will respond to your request within the timelines required by GDPR.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            © {new Date().getFullYear()} CyberNark. All rights reserved. | Privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
}