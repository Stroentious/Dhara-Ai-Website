import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tractor, Grid, MapPin, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FarmDTO, FieldDTO, CropDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';
import { FarmLocationMap } from '@/components/maps/FarmLocationMap';

export const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<FarmDTO | null>(null);
  const [fields, setFields] = useState<FieldDTO[]>([]);
  const [crops, setCrops] = useState<CropDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Add Field Modal
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldDesc, setFieldDesc] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [fieldSoilType, setFieldSoilType] = useState('Loam');
  const [fieldLat, setFieldLat] = useState('');
  const [fieldLng, setFieldLng] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFarmData = async () => {
    if (!farmId) return;
    setIsLoading(true);
    try {
      const farmData = await apiClient.getFarmById(farmId);
      setFarm(farmData);
      const fieldsData = await apiClient.getFieldsForFarm(farmId);
      setFields(fieldsData);
      const cropsData = await apiClient.getCrops();
      setCrops(cropsData);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load farm details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFarmData();
  }, [farmId]);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !fieldName.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiClient.createField(farmId, {
        name: fieldName.trim(),
        description: fieldDesc.trim() || undefined,
        area: fieldArea ? parseFloat(fieldArea) : undefined,
        soilType: fieldSoilType,
        latitude: fieldLat ? parseFloat(fieldLat) : undefined,
        longitude: fieldLng ? parseFloat(fieldLng) : undefined,
        initialCropId: selectedCropId || undefined,
      });
      setShowAddFieldModal(false);
      setFieldName('');
      setFieldDesc('');
      setFieldArea('');
      setFieldLat('');
      setFieldLng('');
      setSelectedCropId('');
      await loadFarmData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create field');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-500">
        Loading farm facility details...
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-rose-400 font-bold text-sm">Farm Not Found</div>
        <Button onClick={() => navigate('/app/farms')} size="sm" variant="outline">
          Return to Farms
        </Button>
      </div>
    );
  }

  // Map markers for Farm & Fields
  const mapMarkers = [
    ...(farm.latitude && farm.longitude
      ? [
          {
            id: farm.id,
            name: farm.name,
            latitude: farm.latitude,
            longitude: farm.longitude,
            type: 'FARM' as const,
            details: farm.locationName || undefined,
          },
        ]
      : []),
    ...fields
      .filter((f) => f.latitude && f.longitude)
      .map((f) => ({
        id: f.id,
        name: f.name,
        latitude: f.latitude!,
        longitude: f.longitude!,
        type: 'FIELD' as const,
        details: `Soil: ${f.soilType || 'N/A'}, Area: ${f.area ? `${f.area} ${f.areaUnit}` : 'N/A'}`,
      })),
  ];

  return (
    <div className="py-8">
      <Section variant="default">
        <Container>
          <div className="space-y-6">
            {/* Top Navigation */}
            <button
              onClick={() => navigate('/app/farms')}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Farms List</span>
            </button>

            {/* Farm Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 font-mono text-[10px]"
                  >
                    FARM FACILITY OVERVIEW
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">ID: {farm.id}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
                  <Tractor className="h-6 w-6 text-emerald-400" />
                  <span>{farm.name}</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-xl">
                  {farm.description || 'No detailed farm description provided.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-dhara-dark border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block">LOCATION</span>
                  <div className="flex items-center space-x-1 font-bold text-emerald-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{farm.locationName || 'Unspecified'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-dhara-dark border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block">TOTAL AREA</span>
                  <span className="font-bold text-slate-200">
                    {farm.area ? `${farm.area} ${farm.areaUnit}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Farm Location Map (Markers Only - No fake boundaries) */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Geographic Location Visualization</span>
              </h2>
              <FarmLocationMap markers={mapMarkers} />
            </div>

            {/* Nested Fields Section */}
            <div className="space-y-4 pt-4 border-t border-dhara-surfaceBorder">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <Grid className="h-5 w-5 text-cyan-400" />
                    <span>Land Fields ({fields.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Soil boundaries and production field units belonging to this farm
                  </p>
                </div>

                <Button
                  onClick={() => setShowAddFieldModal(true)}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Field</span>
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-3">
                  <Grid className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No land fields configured for this farm facility yet.
                  </p>
                  <Button
                    onClick={() => setShowAddFieldModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                  >
                    + Create First Field
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      onClick={() => navigate(`/app/fields/${field.id}`)}
                      className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface hover:border-cyan-500/40 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400 font-mono text-[9px]"
                        >
                          FIELD PARCEL
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Soil: {field.soilType || 'Loam'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {field.name}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {field.description || 'No description.'}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Area: {field.area ? `${field.area} ${field.areaUnit}` : 'N/A'}</span>
                        <span className="text-cyan-400 text-[11px] font-sans font-semibold">
                          View Zones →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dhara-slate border border-dhara-surfaceBorder rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Grid className="h-5 w-5 text-cyan-400" />
              <span>Create Land Field</span>
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateField} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Field Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Wheat Block"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Area (hectares)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 10"
                    value={fieldArea}
                    onChange={(e) => setFieldArea(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Soil Type</label>
                  <select
                    value={fieldSoilType}
                    onChange={(e) => setFieldSoilType(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Loam">Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Silt">Silt</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 30.7350"
                    value={fieldLat}
                    onChange={(e) => setFieldLat(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 76.7800"
                    value={fieldLng}
                    onChange={(e) => setFieldLng(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Initial Crop (Optional)</label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">None (Select Crop Later)</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional field details..."
                  value={fieldDesc}
                  onChange={(e) => setFieldDesc(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Create Field'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
