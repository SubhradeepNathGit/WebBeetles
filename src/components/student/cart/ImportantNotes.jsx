import React from 'react'
import { Info } from 'lucide-react'

const ImportantNotes = () => {
    return (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex gap-3">
                <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/80">
                    <p className="font-semibold mb-2 text-white">Important Information:</p>
                    <ul className="space-y-1 text-white/60">
                        <li>• Instant access to course materials after payment</li>
                        <li>• Sessions can be scheduled within 24 hours</li>
                        <li>• All courses include email support for 6 months</li>
                        <li>• 30-day money-back guarantee applies to all purchases</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ImportantNotes