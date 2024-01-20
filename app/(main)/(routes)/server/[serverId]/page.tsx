type ServerIdPageProps = {
  params: { serverId: string };
};

export default function ServerIdPage({ params }: ServerIdPageProps) {
  return <div>server {params.serverId} page</div>;
}
