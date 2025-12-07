export default function DemoSmoothCursor() {
  return (
    <>
      <div className="hidden text-center *:my-0 sm:block">
        <p>Move your mouse around</p>
        <p className="text-sm">(you already saw the cursor lmfao)</p>
      </div>
      <div className="text-center *:my-0 sm:hidden">
        <p>oop, mobile are not supported!</p>
        <p className="text-sm">use a device that has a mouse.</p>
      </div>
    </>
  );
}
