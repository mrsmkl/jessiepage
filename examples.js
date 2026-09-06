export const BUILTIN_EXAMPLES = [
  { key: 'basics', name: 'Example · Basics', bbox: [-6,6,6,-6], source: `// Free points, lines, polygon, midpoint and circle.
A = point(-3, -1);
B = point(3, -1);
C = point(0, 3);
AB = segment(A, B);
BC = line(B, C) << dash: 2 >>;
tri = polygon(A, B, C) << fillColor: '#dbeafe', fillOpacity: 0.35 >>;
M = midpoint(A, B);
c = circle(M, C) << strokeColor: '#7c3aed' >>;` },
  { key: 'intersections', name: 'Example · Intersections', bbox: [-6,6,6,-6], source: `A = point(-2, 0);
B = point(2, 0);
c1 = circle(A, 3) << fillOpacity: 0.06 >>;
c2 = circle(B, 3) << fillOpacity: 0.06 >>;
P = intersection(c1, c2, 0);
Q = intersection(c1, c2, 1);
segment(A, B);
segment(P, Q) << dash: 2 >>;` },
  { key: 'glider', name: 'Example · Glider + tangent', bbox: [-6,6,6,-6], source: `O = point(0, 0);
R = point(3, 0);
c = circle(O, R);
P = glider(0, 3, c);
t = tangent(P);
segment(O, P) << dash: 2 >>;` },
  { key: 'functions', name: 'Example · Function plots', bbox: [-6,6,6,-6], source: `f = functiongraph('sin(x)') << strokeWidth: 3 >>;
g = functiongraph('0.25*x^2 - 2') << strokeColor: '#d97706' >>;
h = functiongraph('2*cos(x/2)') << strokeColor: '#7c3aed', dash: 2 >>;` },
  { key: 'slider', name: 'Example · Slider + function', bbox: [-6,6,6,-6], source: `a = slider([-4, -4], [2, -4], [-2, 1, 2]) << name: 'a' >>;
f = functiongraph(map (x) -> V(a) * sin(x)) << strokeWidth: 3 >>;` },
  { key: 'cardioid', name: 'Example · Parametric cardioid', bbox: [-6,6,6,-6], source: `fx = map (t) -> 2 * (1 - cos(t)) * cos(t);
fy = map (t) -> 2 * (1 - cos(t)) * sin(t);
c = curve(fx, fy, 0, 2 * PI) << strokeWidth: 3 >>;` },
  { key: 'loop', name: 'Example · Programming', bbox: [-6,6,6,-6], source: `for (i = 0; i < 9; i = i + 1) {
  point(i - 4, 2 * sin(i)) << name: '', withLabel: false >>;
}` },
  { key: 'cas-simplify', name: 'CAS · Simplify', bbox: [-6,6,6,-6], source: `// Plain-text definitions share one CAS scope.
f = (x+1)^2 - (x^2+2*x)
simplify(f)
a = 5`, previousSourceHashes: ['1d7f987a1cd670bac95e763b619eda6f425fba8498c4de448ff09f978d3ad272', 'ad75b581ce876f9bfc051e6ccde0f02ad928850b95ca7aa163d61bd64668bb5f'] },
  { key: 'cas-expand', name: 'CAS · Expand', bbox: [-6,6,6,-6], source: `// Turn on either Graph switch to use the shared canvas.
f = (x+1)^3
expand(f)`, previousSourceHash: '929a7fdc2bf228e8e392ab46a664689608f05a855fd5e22f19fc58b90fcb7be4' },
  { key: 'cas-differentiate', name: 'CAS · Differentiate', bbox: [-8,8,8,-8], source: `// f is defined once and reused by the next line.
f = x^3 + 2*x^2 - x + 4
differentiate(f, x)`, previousSourceHashes: ['2238c1409676ca0c4996c03eb5bbe0b45ba515a682a3ee0a56da169e4a276743', '08decb0d564946f18722e0ad386d8e43011235d4cc59a6078e688fabe0fded3e'] },
  { key: 'cas-solve', name: 'CAS · Solve to points', bbox: [-6,6,6,-6], source: `// solve() uses the current definition and returns every solution.
f = x^2 - 4
solve(f, x)`, previousSourceHashes: ['550770f454f89141d5c196ad112534ace0cfa0f7eb55a32c74c1848324a02c4e', 'fafe34c1409b378eea49d313bd16ec0b28def2e27bb754988d9f8532b912c0f3', 'e7fb538bdff08b6985328e0602a98c4b85a53153ee9da0b3c632f2fb9ccc9e1b'] },
  { key: 'cas-points', name: 'CAS · Point set', bbox: [-6,6,6,-6], source: `// A set of coordinate pairs is graphed together.
samples = {(-3,2),(-1,-2),(1,3),(3,1)}
samples` },
  { key: 'cas-factor', name: 'CAS · Factor', bbox: [-5,8,5,-8], source: `// Factor a polynomial without redefining it.
f = x^3 - 6*x^2 + 11*x - 6
factor(f, x)` },
  { key: 'cas-together', name: 'CAS · Together', bbox: [-6,8,6,-8], source: `// Combine a sum of rational expressions.
f = 1/x + 1/(x+1)
together(f)` },
  { key: 'cas-evaluate', name: 'CAS · Evaluate exactly', bbox: [-6,6,6,-6], source: `// Exact arithmetic stays exact where possible.
a = 2^{10} - 1
evaluate(a)
evaluate(1/3 + 1/6)` },
  { key: 'cas-numeric', name: 'CAS · Numeric approximation', bbox: [-6,6,6,-6], source: `// The optional second argument controls precision.
r = 2^{1/2}
numeric(r)
numeric(r, 30)` },
  { key: 'cas-substitute', name: 'CAS · Substitute', bbox: [-6,8,6,-8], source: `// The result can be graphed as a point on f.
f = x^2 - 4
substitute(f, x, 3)
substitute(f, x, -2)` },
  { key: 'cas-integrate', name: 'CAS · Integrate', bbox: [-5,8,5,-8], source: `// Indefinite results are graphable; definite results are scalars.
f = x^2
integrate(f, x)
integrate(f, x, 0, 2)` },
  { key: 'cas-limit', name: 'CAS · Limit', bbox: [-6,6,6,-6], source: `// The removable hole has the limiting value 2.
f = (x^2 - 1)/(x - 1)
limit(f, x, 1)` }
];

// Standalone JessieCode diagrams, installed once as editable local pages.
BUILTIN_EXAMPLES.push(...[
  {
"key": "euclid-postulate-01",
"name": "Euclid · Postulate 1 · Join two points",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Postulate 1: Join two points\n// A straight segment can be drawn between any two points.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.1 onward.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-4, -1);\nB = point(4, 2);\nsegment(A,B) <<strokeWidth:3>>;\ntext(-9,-5,map () -> 'Length AB = '+round(100*dist(A,B))/100) <<display:'internal',fontSize:16>>;\ntext(-9,6,'Postulate 1: Join two points') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "77b9e79e675f770baf2010489ed5efb62f9b1e101e9d10d159a12ff43b5b458e"
  },
  {
"key": "euclid-postulate-02",
"name": "Euclid · Postulate 2 · Extend a straight segment",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Postulate 2: Extend a straight segment\n// A finite straight line can be extended continuously along the same straight line.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.2, I.5, I.16, I.20.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-3, 0);\nB = point(2, 1);\nline(A,B) <<strokeColor:'#99a4af',dash:2>>;\nsegment(A,B) <<strokeWidth:3>>;\nC=point(map () -> 2*X(B)-X(A), map () -> 2*Y(B)-Y(A));\nsegment(B,C) <<strokeWidth:3,strokeColor:'#b45b27'>>;\ntext(-9,-5,map () -> 'AB = '+round(100*dist(A,B))/100+'; BC = '+round(100*dist(B,C))/100+'. The direction is unchanged.') <<display:'internal',fontSize:16>>;\ntext(-9,6,'Postulate 2: Extend a straight segment') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "d27cfd6c6c55e7e31cc72c91ad68c786cf4af757e05ea9c43a4ab68506f742b3"
  },
  {
"key": "euclid-postulate-03",
"name": "Euclid · Postulate 3 · Draw a circle",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Postulate 3: Draw a circle\n// A circle can be drawn with any center and distance.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.1–3, I.9–12, I.22.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nO = point(0, 0);\nA = point(3, 1);\nc=circle(O,A) <<strokeWidth:3>>;\nsegment(O,A) <<dash:2>>;\ntext(-9,-5,map () -> 'Center O; radius OA = '+round(100*dist(O,A))/100+'. Move either point.') <<display:'internal',fontSize:16>>;\ntext(-9,6,'Postulate 3: Draw a circle') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "6bd106f3bfa5e2c25589c8f95a355a34e324b79935ab88dd89b1c9e3df1bd941"
  },
  {
"key": "euclid-postulate-04",
"name": "Euclid · Postulate 4 · All right angles are equal",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Postulate 4: All right angles are equal\n// All right angles are equal to one another, regardless of orientation or size.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.13–15, I.29, I.46–48.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-6, 0);\nB = point(-3, 0);\nC=point(map () -> X(A)-(Y(B)-Y(A)),map () -> Y(A)+X(B)-X(A));\nD = point(2, -1);\nE = point(4, 1);\nF=point(map () -> X(D)-1.2*(Y(E)-Y(D)),map () -> Y(D)+1.2*(X(E)-X(D)));\nsegment(A,B); segment(A,C);\nsegment(D,E); segment(D,F);\nangle(B,A,C) <<name:'90°',selection:'minor'>>;\nangle(E,D,F) <<name:'90°',selection:'minor'>>;\ntext(-9,-5,map () -> 'Angles BAC and EDF: '+round(10*deg(B,A,C))/10+'° and '+round(10*deg(E,D,F))/10+'°') <<display:'internal',fontSize:16>>;\ntext(-9,6,'Postulate 4: All right angles are equal') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "ea10cabecbb490ba3b444745a5fb6c1744b688269330d58ece30bb13f14f40bd"
  },
  {
"key": "euclid-postulate-05",
"name": "Euclid · Postulate 5 · The parallel postulate",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Postulate 5: The parallel postulate\n// If a transversal makes same-side interior angles sum to less than two right angles, the two lines meet on that side.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.29; then I.30–48 through parallel-line results.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-4, 3);\nB = point(0, 2);\nC = point(-4, -3);\nD = point(0, -2);\na=line(A,B); b=line(C,D);\nsegment(B,D) <<strokeColor:'#b45b27',strokeWidth:3>>;\nR=point(map () -> 2*X(B)-X(A),map () -> 2*Y(B)-Y(A)) <<visible:false>>;\nS=point(map () -> 2*X(D)-X(C),map () -> 2*Y(D)-Y(C)) <<visible:false>>;\nE=intersection(a,b,0) <<name:'E'>>;\nangle(R,B,D) <<name:'α',selection:'minor'>>;\nangle(B,D,S) <<name:'β',selection:'minor'>>;\ntext(-9,-4.5,map () -> 'α + β = '+round(10*(min(deg(R,B,D),360-deg(R,B,D))+min(deg(B,D,S),360-deg(B,D,S))))/10+'°') <<display:'internal',fontSize:16>>;\ntext(-9,-5.5,function(){return abs(min(deg(R,B,D),360-deg(R,B,D))+min(deg(B,D,S),360-deg(B,D,S))-180)<0.1 ? 'The lines are parallel.' : (min(deg(R,B,D),360-deg(R,B,D))+min(deg(B,D,S),360-deg(B,D,S))<180 ? 'The lines meet on the marked side.' : 'The lines meet on the opposite side.');}) <<display:'internal',fontSize:16>>;\n// Keep the marked rays on the right of transversal BD when exploring this case.\n// At a 180-degree sum the lines are parallel and E has no finite position.\ntext(-9,6,'Postulate 5: The parallel postulate') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "b1b14012c3319fd7d9c629154e03e8c1faf7d3932fdc1e64da98c9254ac85b8a"
  },
  {
"key": "euclid-common-notion-01",
"name": "Euclid · Common notion 1 · Equality to the same thing",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Common notion 1: Equality to the same thing\n// Magnitudes equal to the same magnitude are equal to one another.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.1: AC=AB and BC=AB imply AC=BC.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-4, 3);\nB = point(1, 3);\nC=point(-4,0) <<fixed:true>>;\nD=point(map () -> -4+dist(A,B),0);\nE=point(-4,-3) <<fixed:true>>;\nF=point(map () -> -4+dist(A,B),-3);\nsegment(A,B) <<strokeWidth:3>>;\nsegment(C,D) <<strokeWidth:3,strokeColor:'#b45b27'>>;\nsegment(E,F) <<strokeWidth:3,strokeColor:'#29917a'>>;\ntext(3,3,'c'); text(3,0,'a = c'); text(3,-3,'b = c');\ntext(-9,-5.5,map () -> 'c = '+round(100*dist(A,B))/100+'; a = '+round(100*dist(C,D))/100+'; b = '+round(100*dist(E,F))/100) <<display:'internal',fontSize:16>>;\n// AB represents c, CD represents a, EF represents b.\ntext(-9,6,'Common notion 1: Equality to the same thing') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "d9e97aacf86123c89dd85c7d5ed358ab2ca7c0b5624109ad193a0246b226fb0d"
  },
  {
"key": "euclid-common-notion-02",
"name": "Euclid · Common notion 2 · Add equals to equals",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Common notion 2: Add equals to equals\n// Adding equal magnitudes to equal magnitudes gives equal totals.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.2, I.13, I.32.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-6, 3);\nB = point(-2, 3);\nC = point(1, 3);\nsegment(A,B) <<strokeWidth:4>>;\nsegment(B,C) <<strokeWidth:4,strokeColor:'#b45b27'>>;\nD=point(-6,-1) <<fixed:true>>;\nE=point(map () -> -6+dist(A,B),-1);\nF=point(map () -> -6+dist(A,B)+dist(B,C),-1);\nG=point(-6,-3) <<fixed:true>>;\nH=point(map () -> -6+dist(A,B),-3);\nK=point(map () -> -6+dist(A,B)+dist(B,C),-3);\nsegment(D,E) <<strokeWidth:4>>; segment(E,F) <<strokeWidth:4,strokeColor:'#b45b27'>>;\nsegment(G,H) <<strokeWidth:4>>; segment(H,K) <<strokeWidth:4,strokeColor:'#b45b27'>>;\ntext(3,-1,'a + b'); text(3,-3,'a + b');\ntext(-9,-5.5,map () -> 'Each total = '+round(100*(dist(A,B)+dist(B,C)))/100+' ('+round(100*dist(A,B))/100+' + '+round(100*dist(B,C))/100+')') <<display:'internal',fontSize:16>>;\ntext(-9,6,'Common notion 2: Add equals to equals') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "a5795b2aaca7c08645ff919d984606d7ab5dc3095ef3898e4b8a752d5bca409b"
  },
  {
"key": "euclid-common-notion-03",
"name": "Euclid · Common notion 3 · Subtract equals from equals",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Common notion 3: Subtract equals from equals\n// Subtracting equal magnitudes from equal magnitudes leaves equal remainders.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.2, I.5, I.15, I.35, I.43.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-6, 3);\nB = point(-2, 3);\nC = point(1, 3);\nsegment(A,B) <<strokeWidth:4>>; segment(B,C) <<strokeWidth:4,strokeColor:'#b45b27'>>;\nD=point(-6,-1) <<fixed:true>>;\nE=point(map () -> -6+dist(A,B),-1);\nF=point(map () -> -6+dist(A,B)+dist(B,C),-1);\nG=point(-6,-3) <<fixed:true>>;\nH=point(map () -> -6+dist(A,B),-3);\nK=point(map () -> -6+dist(A,B)+dist(B,C),-3);\nsegment(D,E) <<strokeColor:'#aaa',dash:2>>; segment(E,F) <<strokeWidth:4,strokeColor:'#b45b27'>>;\nsegment(G,H) <<strokeColor:'#aaa',dash:2>>; segment(H,K) <<strokeWidth:4,strokeColor:'#b45b27'>>;\ntext(-9,-5.5,map () -> 'Remove '+round(100*dist(A,B))/100+' from '+round(100*(dist(A,B)+dist(B,C)))/100+': each remainder = '+round(100*dist(B,C))/100) <<display:'internal',fontSize:16>>;\ntext(-9,6,'Common notion 3: Subtract equals from equals') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "8964d0f7ffa63d583b3d180fddce0d8d907625c28cc50a743bc2f4677e8c9d11"
  },
  {
"key": "euclid-common-notion-04",
"name": "Euclid · Common notion 4 · Coincidence gives equality",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Common notion 4: Coincidence gives equality\n// Magnitudes that coincide under superposition are equal.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.4 superposition argument.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-6, -1);\nB = point(-3, -1);\nC = point(-5, 2);\nt=slider([-6,-4],[3,-4],[0,0,1]) <<name:'Superposition'>>;\nD=point(map () -> X(A)+7*(1-t.Value()),map () -> Y(A));\nE=point(map () -> X(B)+7*(1-t.Value()),map () -> Y(B));\nF=point(map () -> X(C)+7*(1-t.Value()),map () -> Y(C));\npolygon(A,B,C) <<fillColor:'#548abd',fillOpacity:0.3>>;\npolygon(D,E,F) <<fillColor:'#cf9945',fillOpacity:0.3>>;\ntext(-9,-5.5,function(){return abs(1-t.Value())<0.001 ? 'The triangles coincide, so corresponding parts are equal.' : 'Move Superposition to 1. Separation = '+round(100*7*(1-t.Value()))/100;}) <<display:'internal',fontSize:16>>;\ntext(-9,6,'Common notion 4: Coincidence gives equality') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "c2ac825f14af7e8652cfa1ee63a4cd3a96de77a839fdfa633f0b08efd92a0727"
  },
  {
"key": "euclid-common-notion-05",
"name": "Euclid · Common notion 5 · The whole exceeds a part",
"bbox": [
  -10,
  7,
  10,
  -7
],
"source": "// Euclid Book I — Common notion 5: The whole exceeds a part\n// A whole magnitude is greater than a proper part of it.\n// Illustrative model of an assumption, not a proof.\n// Used in: I.6, I.7, I.16, I.39–40.\n$board.setBoundingBox([-10, 7, 10, -7], true);\n\nA = point(-5, 0);\nB = point(5, 0);\nC=point(map () -> X(A)+0.6*(X(B)-X(A)),map () -> Y(A)+0.6*(Y(B)-Y(A)));\nsegment(A,B) <<strokeWidth:8,strokeColor:'#ddd'>>;\nsegment(A,C) <<strokeWidth:4,strokeColor:'#245ea6'>>;\nsegment(C,B) <<strokeWidth:4,strokeColor:'#b45b27'>>;\ntext(-9,-4,map () -> 'AB = '+round(100*dist(A,B))/100+'; AC = '+round(100*dist(A,C))/100+'; CB = '+round(100*dist(C,B))/100) <<display:'internal',fontSize:16>>;\ntext(-9,-5.5,function(){return dist(A,B)<0.001 ? 'Move A and B apart.' : 'AC is '+round(1000*dist(A,C)/dist(A,B))/10+'% of the whole AB.';}) <<display:'internal',fontSize:16>>;\ntext(-9,6,'Common notion 5: The whole exceeds a part') <<display:'internal',fontSize:18>>;\n",
"previousSourceHash": "f00a77c8191461279596fbc63a4a7eb9e92767868ef6df0c957dffa4641c7475"
  },
  {
"key": "euclid-i-01",
"name": "Euclid I.1 · Construct an equilateral triangle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.1: Construct an equilateral triangle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-2, 0);\nB = point(2, 0);\nc1=circle(A,B) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(B,A) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nC=intersection(c1,c2,0) <<name:'C'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'60°', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,B,C) <<name:'60°', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.1') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0f0dc54e00e9b89507fbd359983e5b57e5c92a001fcacd8d2e6244658efef909"
  },
  {
"key": "euclid-i-02",
"name": "Euclid I.2 · Transfer a segment to a given point",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.2: Transfer a segment to a given point\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(0, 0);\nC = point(1, 2);\nsegment(B,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\nc1=circle(A,B) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(B,A) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nD=intersection(c1,c2,0) <<name:'D'>>;\nG=point(map () -> X(D)+(1+dist(B,C)/dist(D,B))*(X(B)-X(D)),map () -> Y(D)+(1+dist(B,C)/dist(D,B))*(Y(B)-Y(D))) <<name:'G', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ncircle(B,C) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nsegment(D,G) <<strokeWidth:2, strokeColor:'#34465d'>>;\nL=point(map () -> X(D)+(dist(D,G)/dist(D,A))*(X(A)-X(D)),map () -> Y(D)+(dist(D,G)/dist(D,A))*(Y(A)-Y(D))) <<name:'L', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ncircle(D,G) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nsegment(D,L) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(A,L) <<strokeWidth:2, strokeColor:'#34465d'>>;\npolygon(D,A,B) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.2') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "acb31cbc2dbc69cc7c3e74a125f8221b197ac2ed9b42c8afc0073f7eb18c6331"
  },
  {
"key": "euclid-i-03",
"name": "Euclid I.3 · Cut the shorter length from the longer",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.3: Cut the shorter length from the longer\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 1);\nB = point(3, 1);\nC = point(-3, -2);\nD = point(-1, -1);\nsegment(A,B) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(C,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nE=point(map () -> X(A)+(dist(C,D)/dist(A,B))*(X(B)-X(A)),map () -> Y(A)+(dist(C,D)/dist(A,B))*(Y(B)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ncircle(A,map () -> dist(C,D)) <<dash:2>>;\nsegment(A,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.3') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "c484403c7a736a0ab488fb837c55600478faee2b9e304e4b1c86786680561b17"
  },
  {
"key": "euclid-i-04",
"name": "Euclid I.4 · Side-angle-side congruence",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.4: Side-angle-side congruence\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-3, 0);\nC = point(-5, 3);\nD=point(map () -> X(A)+7,map () -> Y(A)+0) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(B)+7,map () -> Y(B)+0) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+7,map () -> Y(C)+0) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(D,E,F) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,D,F) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.4') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "c5ca9ab5351b170ee6f067ed65f9c106a721caf908ee0819c72ac4eb36ba6236"
  },
  {
"key": "euclid-i-05",
"name": "Euclid I.5 · Base angles of an isosceles triangle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.5: Base angles of an isosceles triangle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nB = point(-3, 0);\nC = point(3, 0);\nM=midpoint(B,C) <<name:'M'>>;\nl=perpendicular(line(B,C),M) <<dash:2>>;\nA = point(0, 4);\nA.glide(l);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(A)+(1.4)*(X(B)-X(A)),map () -> Y(A)+(1.4)*(Y(B)-Y(A))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(A)+(1.4)*(X(C)-X(A)),map () -> Y(A)+(1.4)*(Y(C)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(B,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(C,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,B,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,C,A) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.5') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "899054776d1932153f98a1081c70dfa21a30bdca003d474adb51f26e388126eb"
  },
  {
"key": "euclid-i-06",
"name": "Euclid I.6 · Equal angles imply equal opposite sides",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.6: Equal angles imply equal opposite sides\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nB = point(-3, 0);\nC = point(3, 0);\nM=midpoint(B,C) <<name:'M'>>;\nl=perpendicular(line(B,C),M) <<dash:2>>;\nA = point(0, 4);\nA.glide(l);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(A)+(1.4)*(X(B)-X(A)),map () -> Y(A)+(1.4)*(Y(B)-Y(A))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(A)+(1.4)*(X(C)-X(A)),map () -> Y(A)+(1.4)*(Y(C)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(B,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(C,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,B,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,C,A) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.6') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "e98b3d5770ac4f456c9b7d2d1d700775416c9f1135c22c18a80b1f25d00fec7b"
  },
  {
"key": "euclid-i-07",
"name": "Euclid I.7 · Uniqueness on the same side of a base",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.7: Uniqueness on the same side of a base\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nc1=circle(A,C) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(B,C) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nD=otherintersection(c1,c2,C) <<name:'D'>>;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.7') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0f5e8627dbf775ec17b199be582611055715b78aeecc304d575d01401d4c6e12"
  },
  {
"key": "euclid-i-08",
"name": "Euclid I.8 · Side-side-side congruence",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.8: Side-side-side congruence\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-3, 0);\nC = point(-5, 3);\nD=point(map () -> X(A)+7,map () -> Y(A)+0) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(B)+7,map () -> Y(B)+0) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+7,map () -> Y(C)+0) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(D,E,F) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,D,F) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.8') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "899eb8d5e0b4132314caf44e10a0875ce0bfc13d9eccf1c893d4ffd8f5843f57"
  },
  {
"key": "euclid-i-09",
"name": "Euclid I.9 · Bisect an angle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.9: Bisect an angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(A)+(dist(A,B)/dist(A,C))*(X(C)-X(A)),map () -> Y(A)+(dist(A,B)/dist(A,C))*(Y(C)-Y(A))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ncircle(A,B) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc1=circle(B,D) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(D,B) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nE=intersection(c1,c2,0) <<name:'E'>>;\nF=intersection(c1,c2,1) <<name:'F'>>;\nbd=line(B,D) <<visible:false>>;\nef=line(E,F) <<visible:false>>;\nM=intersection(bd,ef,0) <<name:'M'>>;\nsegment(B,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(A,M) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(B,A,M) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(M,A,D) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.9') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "3a220c9e14998a1e2145a2eef55c702fec309066da5fb2eba74cbcf5660d7e5b"
  },
  {
"key": "euclid-i-10",
"name": "Euclid I.10 · Bisect a segment",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.10: Bisect a segment\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nc1=circle(A,B) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(B,A) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nC=intersection(c1,c2,0) <<name:'C'>>;\nD=intersection(c1,c2,1) <<name:'D'>>;\nl=line(C,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nM=intersection(line(A,B),l,0) <<name:'M'>>;\nsegment(A,B) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.10') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "ac2da25418c954c209bb07252821bad90f30f4b5a4e713ff8e8a2c1d875b6016"
  },
  {
"key": "euclid-i-11",
"name": "Euclid I.11 · Erect a perpendicular at a point on a line",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.11: Erect a perpendicular at a point on a line\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nP = point(0, 0);\nP.glide(l);\nD=point(map () -> X(P)+(-1)*(X(A)-X(P)),map () -> Y(P)+(-1)*(Y(A)-Y(P))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nc1=circle(A,D) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nc2=circle(D,A) <<strokeColor:'#9ba9b9',strokeWidth:1,dash:2>>;\nE=intersection(c1,c2,0) <<name:'E'>>;\nsegment(A,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(P,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,P,E) <<name:'', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.11') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "4fe1fbe9a5e66cf28c9c359e8e5eb314c3c512e22d23eb2b3f8412db0d81efe6"
  },
  {
"key": "euclid-i-12",
"name": "Euclid I.12 · Drop a perpendicular to a line",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.12: Drop a perpendicular to a line\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(0, 3);\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nc=circle(C,map () -> sqrt(((X(B)-X(A))*(Y(C)-Y(A))-(Y(B)-Y(A))*(X(C)-X(A)))^2/dist(A,B)^2+dist(A,B)^2/4)) <<dash:2>>;\nD=intersection(l,c,0) <<name:'D'>>;\nE=intersection(l,c,1) <<name:'E'>>;\nM=midpoint(D,E) <<name:'M'>>;\nsegment(C,M) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,M,C) <<name:'', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.12') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "6a84b8d05d6b6292034389e964f389c078a4169d169ee2caa397fdc881ec3d47"
  },
  {
"key": "euclid-i-13",
"name": "Euclid I.13 · Adjacent angles on a straight line",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.13: Adjacent angles on a straight line\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nO = point(0, 0);\nA = point(4, 0);\nB = point(1, 3);\nC=point(map () -> X(O)+(-1)*(X(A)-X(O)),map () -> Y(O)+(-1)*(Y(A)-Y(O))) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(O,A) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(O,B) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(O,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,O,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,O,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.13') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "5710b58ca50398b85448e032ebae4f3869ffa0508907be8588525d30e09cefbb"
  },
  {
"key": "euclid-i-14",
"name": "Euclid I.14 · Supplementary adjacent angles imply a straight",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.14: Supplementary adjacent angles imply a straight line\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nO = point(0, 0);\nA = point(4, 0);\nB = point(1, 3);\nC=point(map () -> X(O)+(-1)*(X(A)-X(O)),map () -> Y(O)+(-1)*(Y(A)-Y(O))) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(O,A) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(O,B) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(O,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,O,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,O,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.14') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "bd8c4a43163b6da3a729c849fe843f1dae3d7bc236e73466437f7bc86fc64192"
  },
  {
"key": "euclid-i-15",
"name": "Euclid I.15 · Vertical angles",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.15: Vertical angles\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nO = point(0, 0);\nA = point(4, 0);\nB = point(1, 3);\nC=point(map () -> X(O)+(-1)*(X(A)-X(O)),map () -> Y(O)+(-1)*(Y(A)-Y(O))) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nD=point(map () -> X(O)+(-1)*(X(B)-X(O)),map () -> Y(O)+(-1)*(Y(B)-Y(O))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nline(A,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nline(B,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nangle(A,O,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(C,O,D) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,O,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(D,O,A) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.15') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "b53cf72ba3c06824ad908b1b997540b6516484c522d68fe0ca090cc27dafa348"
  },
  {
"key": "euclid-i-16",
"name": "Euclid I.16 · Exterior angle exceeds either remote interior ",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.16: Exterior angle exceeds either remote interior angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(B)+(1.6)*(X(C)-X(B)),map () -> Y(B)+(1.6)*(Y(C)-Y(B))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(C,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nM=midpoint(A,C) <<name:'M'>>;\nE=point(map () -> X(B)+(2)*(X(M)-X(B)),map () -> Y(B)+(2)*(Y(M)-Y(B))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(B,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(C,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,C,D) <<name:'γ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(C,A,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.16') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "9193df3869ebfb49fe46a299dc33b4d4c6a8922d6cb47ca42a3d50d57da948f4"
  },
  {
"key": "euclid-i-17",
"name": "Euclid I.17 · Any two triangle angles sum to less than two r",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.17: Any two triangle angles sum to less than two right angles\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(C,A,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,C,A) <<name:'γ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.17') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "de6d49f40f3c81842444405d2f7063435c3563df8567b5ba9ca7c2845c0fc4a4"
  },
  {
"key": "euclid-i-18",
"name": "Euclid I.18 · Greater side faces greater angle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.18: Greater side faces greater angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,C,B) <<name:'γ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.18') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0684532d9bf8ca5a190c4377583ce3333c70a91fd65378a47c281a238a9bf0ef"
  },
  {
"key": "euclid-i-19",
"name": "Euclid I.19 · Greater angle faces greater side",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.19: Greater angle faces greater side\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,C,B) <<name:'γ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.19') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "ab1bc28c1296dbe6e106971ea87abb89fe7279beb9d2604207cd9d63b28ac34f"
  },
  {
"key": "euclid-i-20",
"name": "Euclid I.20 · Triangle inequality",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.20: Triangle inequality\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(B)+(1+dist(A,C)/dist(A,B))*(X(A)-X(B)),map () -> Y(B)+(1+dist(A,C)/dist(A,B))*(Y(A)-Y(B))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(A,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(C,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.20') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0acabdfd5a8327a75372f310d86597444dd5dd08f9fc04a245bb1d5b3c5a478d"
  },
  {
"key": "euclid-i-21",
"name": "Euclid I.21 · Two segments meeting inside a triangle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.21: Two segments meeting inside a triangle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> (X(A)+X(B)+X(C))/3,map () -> (Y(A)+Y(B)+Y(C))/3) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(A,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(B,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(A,D,B) <<name:'δ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,C,B) <<name:'γ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.21') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "6236ee6ec23e12da5258feffbe5f27458e094ac3fc6cba53c0611f0a59a8f02c"
  },
  {
"key": "euclid-i-22",
"name": "Euclid I.22 · Construct a triangle from three lengths",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.22: Construct a triangle from three lengths\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nU = point(-6, -4);\nV = point(-2, -4);\nW = point(0, -4);\nZ = point(3, -4);\nH = point(5, -4);\nK = point(10, -4);\nsegment(U,V) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(W,Z) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(H,K) <<strokeWidth:2, strokeColor:'#34465d'>>;\nA = point(-2, 0);\nB=point(map () -> X(A)+dist(U,V),map () -> Y(A)) <<name:'B', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nc1=circle(A,map () -> dist(H,K)) <<dash:2>>;\nc2=circle(B,map () -> dist(W,Z)) <<dash:2>>;\nC=intersection(c1,c2,0) <<name:'C'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.22') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "5c23fb2189b7098fa186c98490ad2a67f35d2b89b4f4579b21973716a787c2d3"
  },
  {
"key": "euclid-i-23",
"name": "Euclid I.23 · Copy an angle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.23: Copy an angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-3, 0);\nC = point(-5, 3);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD = point(1, 0);\nE = point(5, 0);\nF=point(map () -> X(D)+(dist(A,B)/dist(D,E))*(X(E)-X(D)),map () -> Y(D)+(dist(A,B)/dist(D,E))*(Y(E)-Y(D))) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nc1=circle(D,map () -> dist(A,C)) <<dash:2>>;\nc2=circle(F,map () -> dist(B,C)) <<dash:2>>;\nG=intersection(c1,c2,0) <<name:'G'>>;\nsegment(D,E) <<strokeWidth:2, strokeColor:'#34465d'>>;\npolygon(D,F,G) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(F,D,G) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.23') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "94442c0bb8fde627fc06d7ef197f0dbd7396249ab4671abf9851b9d56cba985b"
  },
  {
"key": "euclid-i-24",
"name": "Euclid I.24 · Larger included angle gives larger base",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.24: Larger included angle gives larger base\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-2, 0);\nC = point(-4, 3);\nD=point(map () -> X(A)+7,map () -> Y(A)+0) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(B)+7,map () -> Y(B)+0) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(D)+dist(A,C)*cos(atan2(Y(B)-Y(A),X(B)-X(A))+acos(max(-1,min(1,((X(B)-X(A))*(X(C)-X(A))+(Y(B)-Y(A))*(Y(C)-Y(A)))/(dist(B,A)*dist(C,A)))))/2),map () -> Y(D)+dist(A,C)*sin(atan2(Y(B)-Y(A),X(B)-X(A))+acos(max(-1,min(1,((X(B)-X(A))*(X(C)-X(A))+(Y(B)-Y(A))*(Y(C)-Y(A)))/(dist(B,A)*dist(C,A)))))/2)) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(D,E,F) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,D,F) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.24') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "358858b93bfba8d1dc089c0a0f8cce83c3f491126b4a880dc3fd5fbea9452b6a"
  },
  {
"key": "euclid-i-25",
"name": "Euclid I.25 · Larger base gives larger included angle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.25: Larger base gives larger included angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-2, 0);\nC = point(-4, 3);\nD=point(map () -> X(A)+7,map () -> Y(A)+0) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(B)+7,map () -> Y(B)+0) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(D)+dist(A,C)*cos(atan2(Y(B)-Y(A),X(B)-X(A))+acos(max(-1,min(1,((X(B)-X(A))*(X(C)-X(A))+(Y(B)-Y(A))*(Y(C)-Y(A)))/(dist(B,A)*dist(C,A)))))/2),map () -> Y(D)+dist(A,C)*sin(atan2(Y(B)-Y(A),X(B)-X(A))+acos(max(-1,min(1,((X(B)-X(A))*(X(C)-X(A))+(Y(B)-Y(A))*(Y(C)-Y(A)))/(dist(B,A)*dist(C,A)))))/2)) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(D,E,F) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,D,F) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.25') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "b333c921662229f38c35739efac4ecc8a31c572ae7c5af86c849f5eae9678a8e"
  },
  {
"key": "euclid-i-26",
"name": "Euclid I.26 · Angle-side congruence (ASA and AAS)",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.26: Angle-side congruence (ASA and AAS)\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-3, 0);\nC = point(-5, 3);\nD=point(map () -> X(A)+7,map () -> Y(A)+0) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nE=point(map () -> X(B)+7,map () -> Y(B)+0) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+7,map () -> Y(C)+0) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(D,E,F) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,D,F) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(D,E,F) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.26') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0d6e5498c25655e43003ab5b2d18b25ab815595c3e4b6e5285439ef72d736f62"
  },
  {
"key": "euclid-i-27",
"name": "Euclid I.27 · Alternate angles imply parallel lines",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.27: Alternate angles imply parallel lines\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nC = point(-3, 3);\nD=point(map () -> X(B)+X(C)-X(A),map () -> Y(B)+Y(C)-Y(A)) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(C,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nE=point(map () -> X(A)+(0.5)*(X(B)-X(A)),map () -> Y(A)+(0.5)*(Y(B)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+(0.65)*(X(D)-X(C)),map () -> Y(C)+(0.65)*(Y(D)-Y(C))) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nline(E,F) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nangle(A,E,F) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,F,D) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.27') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "5f2195b3105b282d65711e8c33dfe05d0a16aa138fba7609d9acba1257250b4f"
  },
  {
"key": "euclid-i-28",
"name": "Euclid I.28 · Corresponding or supplementary angles imply pa",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.28: Corresponding or supplementary angles imply parallels\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nC = point(-3, 3);\nD=point(map () -> X(B)+X(C)-X(A),map () -> Y(B)+Y(C)-Y(A)) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(C,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nE=point(map () -> X(A)+(0.5)*(X(B)-X(A)),map () -> Y(A)+(0.5)*(Y(B)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+(0.65)*(X(D)-X(C)),map () -> Y(C)+(0.65)*(Y(D)-Y(C))) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nline(E,F) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nangle(B,E,F) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,F,D) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.28') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "edf8b6e0d19314d966ad8b71a77639052a0fcb6b7ea9a41f2918e62834309f6a"
  },
  {
"key": "euclid-i-29",
"name": "Euclid I.29 · Angles made by a transversal of parallel lines",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.29: Angles made by a transversal of parallel lines\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nC = point(-3, 3);\nD=point(map () -> X(B)+X(C)-X(A),map () -> Y(B)+Y(C)-Y(A)) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(C,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nE=point(map () -> X(A)+(0.5)*(X(B)-X(A)),map () -> Y(A)+(0.5)*(Y(B)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(C)+(0.65)*(X(D)-X(C)),map () -> Y(C)+(0.65)*(Y(D)-Y(C))) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nline(E,F) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nangle(A,E,F) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(E,F,D) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(B,E,F) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.29') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "651f2d67ae3e24dc1a246699adae2c3fd4ff177c687cd28196c4f10b49a53114"
  },
  {
"key": "euclid-i-30",
"name": "Euclid I.30 · Lines parallel to the same line",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.30: Lines parallel to the same line\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nC = point(-3, 3);\nD = point(-2, -3);\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=parallel(l,C) <<dash:2>>;\nk=parallel(l,D) <<dash:2>>;\nE=point(map () -> X(B)+X(C)-X(A),map () -> Y(B)+Y(C)-Y(A)) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ntext(-8,8,'I.30') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "f0104bd806bc80ede57b604af2bdf83c1967e91aec5cd924d63c89fc33fb0a8f"
  },
  {
"key": "euclid-i-31",
"name": "Euclid I.31 · Draw a parallel through a point",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.31: Draw a parallel through a point\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nC = point(-1, 3);\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nD=point(map () -> X(B)+X(C)-X(A),map () -> Y(B)+Y(C)-Y(A)) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nm=line(C,D) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nsegment(A,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.31') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "f84367f9a8dd36889969f646d63bbd969d47563b756fca276e9521f13bd7c10b"
  },
  {
"key": "euclid-i-32",
"name": "Euclid I.32 · Exterior angle and the triangle angle sum",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.32: Exterior angle and the triangle angle sum\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nC = point(-1, 4);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(B)+(1.6)*(X(C)-X(B)),map () -> Y(B)+(1.6)*(Y(C)-Y(B))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(C,D) <<strokeWidth:2, strokeColor:'#34465d'>>;\nparallel(line(A,B),C) <<dash:2>>;\nangle(C,A,B) <<name:'α', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,B,C) <<name:'β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\nangle(A,C,D) <<name:'α+β', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.32') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "3f7e9d2966bcc6b3d29a40601c8acf560a93fbb4354c8be5d0a29841ab375083"
  },
  {
"key": "euclid-i-33",
"name": "Euclid I.33 · Joining equal parallel segments",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.33: Joining equal parallel segments\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nD = point(-1, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nsegment(A,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.33') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "6b9b6b054eb354fc4286096f8e75ce96ba0a6c6db44e7c80cb93ca236ad6af86"
  },
  {
"key": "euclid-i-34",
"name": "Euclid I.34 · Opposite parts and diagonal of a parallelogram",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.34: Opposite parts and diagonal of a parallelogram\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-3, 0);\nB = point(3, 0);\nD = point(-1, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nsegment(A,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntext(-8,8,'I.34') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "50ca31d7ec079027978b1c810b48e95770c82e20358fa854c8b229dbcc99b9e3"
  },
  {
"key": "euclid-i-35",
"name": "Euclid I.35 · Parallelograms on the same base",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.35: Parallelograms on the same base\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=A;\nV=B;\nF=point(map () -> X(V)+X(E)-X(U),map () -> Y(V)+Y(E)-Y(U)) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\npolygon(U,V,F,E) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ntext(-8,8,'I.35') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0ea1075725a750fa7902378b2f6f9f7ccc901c2712e0d284d2cbb412db898355"
  },
  {
"key": "euclid-i-36",
"name": "Euclid I.36 · Parallelograms on equal bases",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.36: Parallelograms on equal bases\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=point(map () -> X(A)+(1.6)*(X(B)-X(A)),map () -> Y(A)+(1.6)*(Y(B)-Y(A))) <<name:'U', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nV=point(map () -> X(B)+X(U)-X(A),map () -> Y(B)+Y(U)-Y(A)) <<name:'V', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(V)+X(E)-X(U),map () -> Y(V)+Y(E)-Y(U)) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\npolygon(U,V,F,E) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ntext(-8,8,'I.36') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "f92cafefbb5bfdbc28af7729bfa234bb3b2d179ee3a8a3058d249a6ffec705ac"
  },
  {
"key": "euclid-i-37",
"name": "Euclid I.37 · Triangles on the same base",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.37: Triangles on the same base\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=A;\nV=B;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(U,V,E) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.37') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "873af1ea4e57b21b7d6935911aa60c1444c1d7a95d861969a9d5425fe9df101a"
  },
  {
"key": "euclid-i-38",
"name": "Euclid I.38 · Triangles on equal bases",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.38: Triangles on equal bases\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=point(map () -> X(A)+(1.6)*(X(B)-X(A)),map () -> Y(A)+(1.6)*(Y(B)-Y(A))) <<name:'U', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nV=point(map () -> X(B)+X(U)-X(A),map () -> Y(B)+Y(U)-Y(A)) <<name:'V', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(U,V,E) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.38') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "c18e6936542203e23f8fbcee358b13eb71b8df3d733a4ec8639280e160649d9f"
  },
  {
"key": "euclid-i-39",
"name": "Euclid I.39 · Equal triangles on the same base imply paralle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.39: Equal triangles on the same base imply parallels\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=A;\nV=B;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(U,V,E) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.39') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0c2fb372b135cc3e6ca6b41256982e61900826989ad5da5dcdd3db032b990bb0"
  },
  {
"key": "euclid-i-40",
"name": "Euclid I.40 · Equal triangles on equal bases imply parallels",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.40: Equal triangles on equal bases imply parallels\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-5, 0);\nB = point(-1, 0);\nD = point(-4, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(A,B) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nm=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nU=point(map () -> X(A)+(1.6)*(X(B)-X(A)),map () -> Y(A)+(1.6)*(Y(B)-Y(A))) <<name:'U', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nV=point(map () -> X(B)+X(U)-X(A),map () -> Y(B)+Y(U)-Y(A)) <<name:'V', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\npolygon(U,V,E) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.40') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "0148537c10568c9ef62dd61e0062df1236b02c8a0532b165b034bdd3fe731712"
  },
  {
"key": "euclid-i-41",
"name": "Euclid I.41 · Parallelogram is twice a triangle",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.41: Parallelogram is twice a triangle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(2, 0);\nD = point(-3, 3);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nl=line(D,C) <<strokeColor:'#99a4af',strokeWidth:1,dash:2>>;\nslide=slider([-6,-3],[-2,-3],[-1,1.75,3]) <<name:'Shear',snapWidth:0.01>>;\nE=point(map () -> X(D)+(slide.Value())*(X(C)-X(D)),map () -> Y(D)+(slide.Value())*(Y(C)-Y(D))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\npolygon(A,B,E) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ntext(-8,8,'I.41') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "2fde2a67d108f88017925f35ea2aaf924d276244b9b2ab5809347151f33ab1fe"
  },
  {
"key": "euclid-i-42",
"name": "Euclid I.42 · Parallelogram equal to a triangle in a given a",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.42: Parallelogram equal to a triangle in a given angle\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-2, 0);\nC = point(-5, 3);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nU = point(1, 0);\nV = point(5, 0);\nH = point(3, 3);\nsegment(U,H) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntarget=map () -> abs((X(B)-X(A))*(Y(C)-Y(A))-(Y(B)-Y(A))*(X(C)-X(A)))/2;\ncross=map () -> abs((X(V)-X(U))*(Y(H)-Y(U))-(Y(V)-Y(U))*(X(H)-X(U)));\nW=point(map () -> X(U)+(target()/cross())*(X(H)-X(U)),map () -> Y(U)+(target()/cross())*(Y(H)-Y(U))) <<name:'W', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nZ=point(map () -> X(V)+X(W)-X(U),map () -> Y(V)+Y(W)-Y(U)) <<name:'Z', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(U,V,Z,W) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nsegment(U,V) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(V,U,W) <<name:'δ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.42') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "573d23ef8c1371d57e7c79e040cca5aab5cfa00cdaeceac4bad94458ef0c9008"
  },
  {
"key": "euclid-i-43",
"name": "Euclid I.43 · Equal complements about a diagonal",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.43: Equal complements about a diagonal\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-4, 0);\nB = point(4, 0);\nD = point(-2, 5);\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ndiag=segment(A,C) <<strokeWidth:2, strokeColor:'#34465d'>>;\nslide=slider([-6,-3],[-2,-3],[0.05,0.5,0.95]) <<name:'Division',snapWidth:0.01>>;\nP=point(map () -> X(A)+(slide.Value())*(X(C)-X(A)),map () -> Y(A)+(slide.Value())*(Y(C)-Y(A))) <<name:'P', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nt=map () -> dist(A,P)/dist(A,C);\nE=point(map () -> X(A)+t()*(X(B)-X(A)),map () -> Y(A)+t()*(Y(B)-Y(A))) <<name:'E', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nF=point(map () -> X(A)+t()*(X(D)-X(A)),map () -> Y(A)+t()*(Y(D)-Y(A))) <<name:'F', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nG=point(map () -> X(B)+X(F)-X(A),map () -> Y(B)+Y(F)-Y(A)) <<name:'G', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nH=point(map () -> X(D)+X(E)-X(A),map () -> Y(D)+Y(E)-Y(A)) <<name:'H', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nsegment(E,H) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(F,G) <<strokeWidth:2, strokeColor:'#34465d'>>;\npolygon(E,B,G,P) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\npolygon(F,P,H,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ntext(-8,8,'I.43') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "33aac50c1a40d10f0ad1f9b9da05f1cbc2eca5a9b6a901224a9081c7d73d22f9"
  },
  {
"key": "euclid-i-44",
"name": "Euclid I.44 · Apply an equal-area parallelogram to a given s",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.44: Apply an equal-area parallelogram to a given segment\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-2, 0);\nC = point(-5, 3);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nU = point(1, 0);\nV = point(5, 0);\nH = point(3, 3);\nsegment(U,H) <<strokeWidth:2, strokeColor:'#34465d'>>;\ntarget=map () -> abs((X(B)-X(A))*(Y(C)-Y(A))-(Y(B)-Y(A))*(X(C)-X(A)))/2;\ncross=map () -> abs((X(V)-X(U))*(Y(H)-Y(U))-(Y(V)-Y(U))*(X(H)-X(U)));\nW=point(map () -> X(U)+(target()/cross())*(X(H)-X(U)),map () -> Y(U)+(target()/cross())*(Y(H)-Y(U))) <<name:'W', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nZ=point(map () -> X(V)+X(W)-X(U),map () -> Y(V)+Y(W)-Y(U)) <<name:'Z', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(U,V,Z,W) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nsegment(U,V) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(V,U,W) <<name:'δ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.44') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "6f5922abd8f1192501bec8037d6871f799477be197324c1286f827acc32bffbd"
  },
  {
"key": "euclid-i-45",
"name": "Euclid I.45 · Parallelogram equal to a rectilinear figure",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.45: Parallelogram equal to a rectilinear figure\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-6, 0);\nB = point(-2, 0);\nC = point(-5, 3);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nU = point(1, 0);\nV = point(5, 0);\nH = point(3, 3);\nsegment(U,H) <<strokeWidth:2, strokeColor:'#34465d'>>;\nD = point(-7, 2);\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ntarget=map () -> abs((X(B)-X(A))*(Y(C)-Y(A))-(Y(B)-Y(A))*(X(C)-X(A)))/2+abs((X(C)-X(A))*(Y(D)-Y(A))-(Y(C)-Y(A))*(X(D)-X(A)))/2;\ncross=map () -> abs((X(V)-X(U))*(Y(H)-Y(U))-(Y(V)-Y(U))*(X(H)-X(U)));\nW=point(map () -> X(U)+(target()/cross())*(X(H)-X(U)),map () -> Y(U)+(target()/cross())*(Y(H)-Y(U))) <<name:'W', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nZ=point(map () -> X(V)+X(W)-X(U),map () -> Y(V)+Y(W)-Y(U)) <<name:'Z', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(U,V,Z,W) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nsegment(U,V) <<strokeWidth:2, strokeColor:'#34465d'>>;\nangle(V,U,W) <<name:'δ', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.45') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "cdb8bd1646f184b23bfebccf3bfe3112d20139ad1943e2fddfa019952238e3b9"
  },
  {
"key": "euclid-i-46",
"name": "Euclid I.46 · Construct a square on a segment",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.46: Construct a square on a segment\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-2, 2);\nB = point(2, 2);\nD=point(map () -> X(A)-(1)*(Y(B)-Y(A)),map () -> Y(A)+(1)*(X(B)-X(A))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\nC=point(map () -> X(B)+X(D)-X(A),map () -> Y(B)+Y(D)-Y(A)) <<name:'C', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,C,D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\nangle(A,B,C) <<name:'', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.46') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "9bbd1ce9748de39ac57851802491ef39fd17177a31fb8d5e35ad90c0d73e17b3"
  },
  {
"key": "euclid-i-47",
"name": "Euclid I.47 · Pythagorean theorem",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.47: Pythagorean theorem\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-2, 1);\nB = point(2, 1);\nl=perpendicular(line(A,B),A) <<visible:false>>;\nC = point(-2, 4);\nC.glide(l);\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\ns1D=point(map () -> X(A)-(-1)*(Y(B)-Y(A)),map () -> Y(A)+(-1)*(X(B)-X(A))) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ns1C=point(map () -> X(B)+X(s1D)-X(A),map () -> Y(B)+Y(s1D)-Y(A)) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,s1C,s1D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ns1=[s1C,s1D];\ns2D=point(map () -> X(B)-(-1)*(Y(C)-Y(B)),map () -> Y(B)+(-1)*(X(C)-X(B))) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ns2C=point(map () -> X(C)+X(s2D)-X(B),map () -> Y(C)+Y(s2D)-Y(B)) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(B,C,s2C,s2D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ns2=[s2C,s2D];\ns3D=point(map () -> X(C)-(-1)*(Y(A)-Y(C)),map () -> Y(C)+(-1)*(X(A)-X(C))) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\ns3C=point(map () -> X(A)+X(s3D)-X(C),map () -> Y(A)+Y(s3D)-Y(C)) <<name:'', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(C,A,s3C,s3D) <<fillColor:'#cf9945', fillOpacity:0.15, borders:<<strokeColor:'#846632',strokeWidth:2>>>>;\ns3=[s3C,s3D];\nq=perpendicular(line(B,C),A) <<dash:2>>;\nedge=line(s2[0],s2[1]) <<visible:false>>;\nR=intersection(q,edge,0) <<name:'L'>>;\nsegment(A,R) <<strokeWidth:2, strokeColor:'#34465d'>>;\nsegment(A,s2[1]) <<strokeColor:'#b45b27',dash:2>>;\nsegment(C,s1[0]) <<strokeColor:'#b45b27',dash:2>>;\nsegment(A,s2[0]) <<strokeColor:'#245ea6',dash:2>>;\nsegment(B,s3[0]) <<strokeColor:'#245ea6',dash:2>>;\nangle(B,A,C) <<name:'', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.47') <<display:'internal',fontSize:20>>;\n",
"previousSourceHashes": ["f81e7f8f581642bfe88a4ee8bc8afcd9103521b440ae007e4b042f7c72c741c2", "586843e871f5dd47a1588a10a15dcb19659ae2a69acd0ab81e1f833bcb4048f2"]
  },
  {
"key": "euclid-i-48",
"name": "Euclid I.48 · Converse of the Pythagorean theorem",
"bbox": [
  -9,
  9,
  13,
  -9
],
"source": "// I.48: Converse of the Pythagorean theorem\n// Drag plain point assignments to update their coordinates in the editor.\n$board.setBoundingBox([-9, 9, 13, -9], true);\n\nA = point(-2, 0);\nB = point(2, 0);\nH = point(-6, -4);\nK = point(-3, -4);\nsegment(H,K) <<strokeWidth:2, strokeColor:'#34465d'>>;\nc1=circle(A,map () -> dist(H,K)) <<dash:2>>;\nc2=circle(B,map () -> sqrt(dist(A,B)^2+dist(H,K)^2)) <<dash:2>>;\nC=intersection(c1,c2,0) <<name:'C'>>;\npolygon(A,B,C) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nD=point(map () -> X(A)-(-dist(H,K)/dist(A,B))*(Y(B)-Y(A)),map () -> Y(A)+(-dist(H,K)/dist(A,B))*(X(B)-X(A))) <<name:'D', size:2, strokeColor:'#b45b27', fillColor:'#b45b27'>>;\npolygon(A,B,D) <<fillColor:'#548abd', fillOpacity:0.12, borders:<<strokeColor:'#34465d',strokeWidth:2>>>>;\nangle(B,A,C) <<name:'', radius:0.55, selection:'minor', fillColor:'#d99c46', fillOpacity:0.24, strokeColor:'#b47a2e', withLabel:true, label:<<display:'internal'>>>>;\ntext(-8,8,'I.48') <<display:'internal',fontSize:20>>;\n",
"previousSourceHash": "dc2441722a6c714783123b529aa0cc9185c8a8e2e9c5b7c7a1068ff64c602057"
  }
]);
