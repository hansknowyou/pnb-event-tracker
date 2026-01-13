'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Edit,
  FileDown,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Circle,
} from 'lucide-react';
import type { Production } from '@/types/production';
import { STEPS } from '@/types/production';

export default function ProductionDashboard() {
  const router = useRouter();
  const params = useParams();
  const productionId = params?.id as string;
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  useEffect(() => {
    fetchProduction();
  }, [productionId]);

  const fetchProduction = async () => {
    try {
      const response = await fetch(`/api/productions/${productionId}`);
      if (response.ok) {
        const data = await response.json();
        setProduction(data);
      }
    } catch (error) {
      console.error('Error fetching production:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTitle = async (newTitle: string) => {
    if (!production) return;

    setIsSavingTitle(true);
    try {
      const response = await fetch(`/api/productions/${productionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const updated = await response.json();
        setProduction(updated);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStepStatus = (stepData: any): 'completed' | 'in-progress' | 'not-started' => {
    // Simplified status calculation
    if (!stepData) return 'not-started';

    // Check if it's an array
    if (Array.isArray(stepData)) {
      return stepData.length > 0 ? 'in-progress' : 'not-started';
    }

    // Check if it's an object with fields
    if (typeof stepData === 'object') {
      const hasData = Object.values(stepData).some((value) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'boolean') return value;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some((v) => {
            if (typeof v === 'string') return v.trim().length > 0;
            if (Array.isArray(v)) return v.length > 0;
            return false;
          });
        }
        return false;
      });
      return hasData ? 'in-progress' : 'not-started';
    }

    return 'not-started';
  };

  const StatusIcon = ({ status }: { status: ReturnType<typeof getStepStatus> }) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'in-progress') {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const LinkButton = ({ url }: { url: string }) => {
    if (!url || !url.trim()) return null;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(url, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Open
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyToClipboard(url)}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
      </div>
    );
  };

  const FieldDisplay = ({ label, value, link }: { label: string; value?: string; link?: string }) => {
    const hasValue = value && value.trim().length > 0;
    const hasLink = link && link.trim().length > 0;

    if (!hasValue && !hasLink) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-red-500">✗</span>
          <span>{label}: Not filled</span>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="font-medium">{label}:</span>
          {value && <span className="text-gray-700">{value}</span>}
        </div>
        {hasLink && (
          <div className="ml-6">
            <LinkButton url={link} />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Production not found</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 max-w-3xl">
                <Input
                  value={production.title}
                  onChange={(e) => setProduction({ ...production, title: e.target.value })}
                  onBlur={() => updateTitle(production.title)}
                  disabled={isSavingTitle}
                  className="text-5xl font-bold border-0 border-b-4 border-transparent hover:border-gray-300 focus:border-blue-500 px-0 rounded-none h-auto py-2 shadow-none focus-visible:ring-0 bg-transparent mb-4"
                  placeholder="Production Title"
                />
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>Created: {formatDate(production.createdAt)}</span>
                  <span>Updated: {formatDate(production.updatedAt)}</span>
                  <span className="font-semibold text-blue-600">
                    Completion: {production.completionPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/productions/${productionId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Form
                </Button>
                <Button variant="outline">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Contract */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step1_contract)} />
                <CardTitle>Step 1: 演出合同签订 (Contract Signing)</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/productions/${productionId}?step=1`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay
              label="Contract"
              link={production.step1_contract.link}
            />
            <FieldDisplay
              label="Notes"
              value={production.step1_contract.notes}
            />
          </CardContent>
        </Card>

        {/* Step 2: Cities */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step2_cities)} />
                <CardTitle>
                  Step 2: 确定演出城市与时间 (Cities & Dates)
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/productions/${productionId}?step=2`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {production.step2_cities.length === 0 ? (
              <div className="text-gray-500">
                <span className="text-red-500">✗</span> No cities added yet
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-medium">
                  <span className="text-green-600">✓</span> Cities (
                  {production.step2_cities.length} total):
                </div>
                {production.step2_cities.map((city, index) => (
                  <div key={city.id} className="ml-6 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold mb-2">
                      {index + 1}. {city.city || 'Unnamed City'}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Date: {city.date || 'Not set'}</div>
                      <div>Time: {city.time || 'Not set'}</div>
                      {city.notes && <div>Notes: {city.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for remaining steps */}
        {STEPS.slice(2).map((step) => (
          <Card key={step.number} className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-gray-400" />
                  <CardTitle>
                    Step {step.number}: {step.name} ({step.description})
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/productions/${productionId}?step=${step.number}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500">
                Dashboard view for this step will be implemented
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
