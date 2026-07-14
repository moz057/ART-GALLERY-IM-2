import React from 'react';
import { Shield, CheckCircle, AlertTriangle, ExternalLink, UserX } from 'lucide-react';
import { Report, Artwork } from '../types';

interface ModeratorViewProps {
  reports: Report[];
  artworks: Artwork[];
  onResolveReport: (reportId: string) => void;
  onArtworkClick: (artworkId: string) => void;
  onDeleteArtwork: (artworkId: string) => void;
}

export default function ModeratorView({
  reports,
  artworks,
  onResolveReport,
  onArtworkClick,
  onDeleteArtwork
}: ModeratorViewProps) {
  
  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
          <Shield className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Moderator Queue</h2>
          <p className="text-sm text-gray-400">Review reported content and enforce community guidelines.</p>
        </div>
      </div>

      {pendingReports.length === 0 && resolvedReports.length === 0 ? (
        <div className="bg-[#111116]/60 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-display text-white font-semibold">All clear!</h3>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto">No reports have been submitted. The community is peaceful.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingReports.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Pending Review ({pendingReports.length})
              </h3>
              <div className="grid gap-4">
                {pendingReports.map(report => {
                  const targetArt = artworks.find(a => a.id === report.artworkId);
                  if (!targetArt) return null;
                  
                  return (
                    <div key={report.id} className="bg-[#111116] border border-red-500/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-start shadow-xl">
                      <img 
                        src={targetArt.imageUrl} 
                        alt="Reported content" 
                        className="w-full sm:w-48 h-32 object-cover rounded-xl cursor-pointer"
                        onClick={() => onArtworkClick(targetArt.id)}
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-semibold flex items-center gap-2">
                              {targetArt.title}
                              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {report.id}
                              </span>
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">Reported by: {report.reporterId} • {report.timestamp}</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-xs font-semibold uppercase tracking-wider">
                            Pending
                          </span>
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                          <p className="text-sm text-gray-300"><span className="text-gray-500 font-mono text-xs">Reason: </span>{report.reason}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 pt-2">
                          <button 
                            onClick={() => onResolveReport(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-sm font-semibold rounded-xl transition-colors text-gray-300 border border-white/5 hover:border-emerald-500/30"
                          >
                            <CheckCircle className="w-4 h-4" /> Keep & Resolve
                          </button>
                          <button 
                            onClick={() => {
                              onDeleteArtwork(targetArt.id);
                              onResolveReport(report.id);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-semibold rounded-xl transition-colors border border-red-500/30 hover:border-red-500"
                          >
                            <UserX className="w-4 h-4" /> Remove Content
                          </button>
                          <button 
                            onClick={() => onArtworkClick(targetArt.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 text-sm font-semibold rounded-xl transition-colors text-gray-400 border border-transparent hover:border-white/10"
                          >
                            <ExternalLink className="w-4 h-4" /> View Post
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {resolvedReports.length > 0 && (
            <div className="space-y-4 pt-8">
              <h3 className="text-lg font-semibold text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                Resolved Reports ({resolvedReports.length})
              </h3>
              <div className="grid gap-3 opacity-60">
                {resolvedReports.map(report => (
                  <div key={report.id} className="bg-[#111116]/50 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 font-mono">{report.id}</p>
                      <p className="text-xs text-gray-500 mt-1">Reason: {report.reason}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
                      Resolved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
