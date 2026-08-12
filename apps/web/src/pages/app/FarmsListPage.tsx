import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Plus, Search, MapPin, Archive, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FarmDTO } from '@dhara/shared';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';

export const FarmsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeOrganization } = useAuth();
  const [farms, setFarms] = useState<FarmDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmDesc, setNewFarmDesc] = useState('');
  const [newFarmLocation, setNewFarmLocation] = useState('');
  const [newFarmLat, setNewFarmLat] = useState('');
  const [newFarmLng, setNewFarmLng] = useState('');
  const [newFarmArea, setNewFarmArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getFarms(activeOrganization?.id);
      setFarms(data);
    } catch {
      setFarms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, [activeOrganization?.id]);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiClient.createFarm({
        organizationId: activeOrganization?.id || '',
        name: newFarmName.trim(),
        description: newFarmDesc.trim() || undefined,
        locationName: newFarmLocation.trim() || undefined,
        latitude: newFarmLat ? parseFloat(newFarmLat) : undefined,
        longitude: newFarmLng ? parseFloat(newFarmLng) : undefined,
        area: newFarmArea ? parseFloat(newFarmArea) : undefined,
      });
      setShowAddModal(false);
      setNewFarmName('');
      setNewFarmDesc('');
      setNewFarmLocation('');
      setNewFarmLat('');
      setNewFarmLng('');
      setNewFarmArea('');
      await loadFarms();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create farm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveFarm = async (farmId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        'Archive this farm facility? Operational data will be preserved in historical archive.',
      )
    )
      return;
    try {
      await apiClient.archiveFarm(farmId);
      await loadFarms();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to archive farm');
    }
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.locationName && f.locationName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="py-8">
      <Section variant="default">
        <Container>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
                  <Tractor className="h-6 w-6 text-emerald-400" />
                  <span>Farm Facilities</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Organize and manage physical farm properties belonging to{' '}
                  {activeOrganization?.name || 'your organization'}
                </p>
              </div>

              <Button
                onClick={() => setShowAddModal(true)}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add Farm Facility</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search farms by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dhara-surface border border-dhara-surfaceBorder rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Farm Cards List */}
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Loading farm facilities from database...
              </div>
            ) : filteredFarms.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface text-center space-y-4 font-sans">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Tractor className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">🌱 No Farms Configured Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Create your first farm facility to begin organizing land fields, irrigation
                  blocks, and crop production cycles.
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  + Add First Farm
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFarms.map((farm) => (
                  <div
                    key={farm.id}
                    onClick={() => navigate(`/app/farms/${farm.id}`)}
                    className="p-5 rounded-2xl border border-dhara-surfaceBorder bg-dhara-surface hover:border-emerald-500/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400 font-mono text-[9px]"
                        >
                          FARM FACILITY
                        </Badge>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {farm.name}
                        </h3>
                      </div>
                      <Button
                        onClick={(e) => handleArchiveFarm(farm.id, e)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Archive Farm"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {farm.description || 'No description provided.'}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[120px]">
                          {farm.locationName || 'Unspecified'}
                        </span>
                      </div>
                      <span>{farm.area ? `${farm.area} ${farm.areaUnit}` : 'Area N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dhara-slate border border-dhara-surfaceBorder rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Tractor className="h-5 w-5 text-emerald-400" />
              <span>Create Farm Facility</span>
            </h2>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateFarm} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Farm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Field Valley"
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. Punjab Sector 4"
                  value={newFarmLocation}
                  onChange={(e) => setNewFarmLocation(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 30.7333"
                    value={newFarmLat}
                    onChange={(e) => setNewFarmLat(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 76.7794"
                    value={newFarmLng}
                    onChange={(e) => setNewFarmLng(e.target.value)}
                    className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Total Area (hectares)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 50"
                  value={newFarmArea}
                  onChange={(e) => setNewFarmArea(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional farm details..."
                  value={newFarmDesc}
                  onChange={(e) => setNewFarmDesc(e.target.value)}
                  className="w-full bg-dhara-dark border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Create Farm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
