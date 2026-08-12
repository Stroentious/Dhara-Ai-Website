import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Layers, Sprout, Plus, ArrowLeft, AlertCircle, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldDTO, ZoneDTO, CropDTO, CropCycleDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';

export const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();

  const [field, setField] = useState<FieldDTO | null>(null);
  const [zones, setZones] = useState<ZoneDTO[]>([]);
  const [cropCycles, setCropCycles] = useState<CropCycleDTO[]>([]);
  const [crops, setCrops] = useState<CropDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Add Zone Modal
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneDesc, setZoneDesc] = useState('');
  const [zoneArea, setZoneArea] = useState('');
  const [zoneIrrigationType, setZoneIrrigationType] = useState<
    'DRIP' | 'SPRINKLER' | 'FLOOD' | 'OTHER'
  >('DRIP');
  const [isSubmittingZone, setIsSubmittingZone] = useState(false);

  // Add Crop Cycle Modal
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [growthStage, setGrowthStage] = useState('SOWING');
  const [notes, setNotes] = useState('');
  const [isSubmittingCycle, setIsSubmittingCycle] = useState(false);

  const loadFieldData = async () => {
    if (!fieldId) return;
    setIsLoading(true);
    try {
      const fData = await apiClient.getFieldById(fieldId);
      setField(fData);
      const zData = await apiClient.getZonesForField(fieldId);
      setZones(zData);
      const cData = await apiClient.getCropCyclesForField(fieldId);
      setCropCycles(cData);
      const catalogData = await apiClient.getCrops();
      setCrops(catalogData);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load field details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFieldData();
  }, [fieldId]);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId || !zoneName.trim()) return;
    setIsSubmittingZone(true);
    setErrorMsg('');
    try {
      await apiClient.createZone(fieldId, {
        name: zoneName.trim(),
        description: zoneDesc.trim() || undefined,
        area: zoneArea ? parseFloat(zoneArea) : undefined,
        irrigationType: zoneIrrigationType,
      });
      setShowAddZoneModal(false);
      setZoneName('');
      setZoneDesc('');
      setZoneArea('');
      await loadFieldData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create zone');
    } finally {
      setIsSubmittingZone(false);
    }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId || !selectedCropId) return;
    setIsSubmittingCycle(true);
    setErrorMsg('');
    try {
      await apiClient.createCropCycle(fieldId, {
        cropId: selectedCropId,
        zoneId: selectedZoneId || undefined,
        seasonName: seasonName.trim() || undefined,
        growthStage: growthStage,
        notes: notes.trim() || undefined,
      });
      setShowAddCycleModal(false);
      setSelectedCropId('');
      setSelectedZoneId('');
      setSeasonName('');
      setNotes('');
      await loadFieldData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create crop cycle');
    } finally {
      setIsSubmittingCycle(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-500">
        Loading land field details...
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-rose-400 font-bold text-sm">Land Field Not Found</div>
        <Button onClick={() => navigate('/app/fields')} size="sm" variant="outline">
          Return to Fields
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Section variant="default">
        <Container>
          <div className="space-y-6">
            {/* Top Navigation */}
            <button
              onClick={() => navigate(`/app/farms/${field.farmId}`)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Parent Farm Facility</span>
            </button>

            {/* Field Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 font-mono text-[10px]"
                  >
                    LAND FIELD PARCEL
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    Soil: {field.soilType || 'Loam'}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
                  <Grid className="h-6 w-6 text-cyan-400" />
                  <span>{field.name}</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-xl">
                  {field.description || 'No detailed field description.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-dhara-dark border border-slate-800 space-y-0.5 font-mono text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 uppercase block">FIELD AREA</span>
                <span className="font-bold text-slate-100">
                  {field.area ? `${field.area} ${field.areaUnit}` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Zones Section */}
            <div className="space-y-4 pt-4 border-t border-dhara-surfaceBorder">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-purple-400" />
                    <span>Irrigation Zones ({zones.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Actuator groups and irrigation blocks configured within this field
                  </p>
                </div>

                <Button
                  onClick={() => setShowAddZoneModal(true)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Zone</span>
                </Button>
              </div>

              {zones.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-3">
                  <Layers className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No irrigation zones configured for this field yet.
                  </p>
                  <Button
                    onClick={() => setShowAddZoneModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                  >
                    + Add Irrigation Zone
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-4 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-400 font-mono text-[9px]"
                        >
                          {zone.irrigationType} IRRIGATED
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {zone.area ? `${zone.area} ${zone.areaUnit}` : 'Area N/A'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">{zone.name}</h3>
                      <p className="text-xs text-slate-400">
                        {zone.description || 'No zone description.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crop Cycles Section */}
            <div className="space-y-4 pt-4 border-t border-dhara-surfaceBorder">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <Sprout className="h-5 w-5 text-amber-400" />
                    <span>Crop Production Cycles ({cropCycles.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Historical & active crop planting seasons for this land field
                  </p>
                </div>

                <Button
                  onClick={() => setShowAddCycleModal(true)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Crop Cycle</span>
                </Button>
              </div>

              {cropCycles.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-3">
                  <Sprout className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No crop cycles recorded for this field yet.
                  </p>
                  <Button
                    onClick={() => setShowAddCycleModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                  >
                    + Register Crop Cycle
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cropCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className="p-4 rounded-xl border border-dhara-surfaceBorder bg-dhara-surface flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 text-amber-400 font-mono text-[10px]"
                          >
                            {cycle.status}
                          </Badge>
                          <span className="font-bold text-slate-100 text-sm">{cycle.cropName}</span>
                          <span className="text-slate-400 font-mono">
                            ({cycle.seasonName || 'Season'})
                          </span>
                        </div>
                        {cycle.notes && <p className="text-slate-400">{cycle.notes}</p>}
                      </div>

                      <div className="flex items-center space-x-4 font-mono text-slate-400 text-[11px]">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-amber-400" />
                          <span>
                            Sown:{' '}
                            {cycle.sowingDate
                              ? new Date(cycle.sowingDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                          Stage: {cycle.growthStage || 'VEGETATIVE'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dhara-slate border border-dhara-surfaceBorder rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <span>Configure Irrigation Zone</span>
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateZone} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Zone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drip Block 1"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Zone Area (hectares)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder={`Max ${field.area || 'N/A'}`}
                    value={zoneArea}
                    onChange={(e) => setZoneArea(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Irrigation Method</label>
                  <select
                    value={zoneIrrigationType}
                    onChange={(e) =>
                      setZoneIrrigationType(
                        e.target.value as 'DRIP' | 'SPRINKLER' | 'FLOOD' | 'OTHER',
                      )
                    }
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="DRIP">DRIP</option>
                    <option value="SPRINKLER">SPRINKLER</option>
                    <option value="FLOOD">FLOOD</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional zone details..."
                  value={zoneDesc}
                  onChange={(e) => setZoneDesc(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingZone}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold"
                >
                  {isSubmittingZone ? 'Saving...' : 'Create Zone'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Crop Cycle Modal */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dhara-slate border border-dhara-surfaceBorder rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sprout className="h-5 w-5 text-amber-400" />
              <span>Register Crop Cycle</span>
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateCycle} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Select Crop *</label>
                <select
                  required
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Select Crop from Catalog...</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Assign to Zone (Optional)</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Whole Field Level</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.irrigationType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Season Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rabi 2026"
                    value={seasonName}
                    onChange={(e) => setSeasonName(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="SOWING">SOWING</option>
                    <option value="GERMINATION">GERMINATION</option>
                    <option value="VEGETATIVE">VEGETATIVE</option>
                    <option value="FLOWERING">FLOWERING</option>
                    <option value="MATURITY">MATURITY</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional planting notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAddCycleModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingCycle}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
                >
                  {isSubmittingCycle ? 'Saving...' : 'Register Cycle'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
