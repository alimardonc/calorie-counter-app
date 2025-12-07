export default function ScanCorners() {
  return (
    <div className="relative w-64 h-64">
      {/* Top Left */}
      <div className="corner top-0 left-0 border-t-4 border-l-4" />

      {/* Top Right */}
      <div className="corner top-0 right-0 border-t-4 border-r-4" />

      {/* Bottom Left */}
      <div className="corner bottom-0 left-0 border-b-4 border-l-4" />

      {/* Bottom Right */}
      <div className="corner bottom-0 right-0 border-b-4 border-r-4" />
    </div>
  );
}
