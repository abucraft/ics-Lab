/*
 * proxy.c - CS:APP Web proxy
 *
 * TEAM MEMBERS:
 *     Andrew Carnegie, ac00@cs.cmu.edu 
 *     Harry Q. Bovik, bovik@cs.cmu.edu
 * 
 * IMPORTANT: Give a high level description of your code here. You
 * must also provide a header comment at the beginning of each
 * function that describes what that function does.
 */ 

#include "csapp.h"
#include "stdio.h"
/*
 * Function prototypes
 */
struct Doitarg{
	int fd;
	FILE* filefd;
	struct sockaddr_in clientaddr;
};
int parse_uri(char *uri, char *target_addr, char *path, int  *port);
void format_log_entry(char *logstring, struct sockaddr_in *sockaddr, char *uri, int size);
void *doit(void* doitarg);
ssize_t Rio_readlineb_w(rio_t *rp, void *usrbuf, size_t maxlen);
ssize_t Rio_readnb_w(rio_t *rp, void *usrbuf, size_t n);
int Rio_writen_w(int fd, void *usrbuf, size_t n);
sem_t writefile,openclient;
/* 
 * main - Main routine for the proxy program 
 */
int main(int argc, char **argv)
{
	signal(SIGPIPE,SIG_IGN);
	sem_init(&writefile,0,1);
	sem_init(&openclient,0,1);
	int listenfd,connfd,port,clientlen;
	FILE*filefd;
	struct sockaddr_in clientaddr;
	pthread_t tid;
    /* Check arguments */
	if (argc != 2) {
		fprintf(stderr, "Usage: %s <port number>\n", argv[0]);
		exit(0);
	}
	port=atoi(argv[1]);
	listenfd=Open_listenfd(port);
	filefd=fopen("proxy.log","wt");
	if(!filefd)
	{
		printf("can't open the log\n");
		exit(0);
	}
	while(1){
		clientlen=sizeof(clientaddr);
		connfd=accept(listenfd,(SA*)&clientaddr,&clientlen);
		struct Doitarg* newarg=malloc(sizeof(struct Doitarg));
		newarg->fd=connfd;
		newarg->filefd=filefd;
		newarg->clientaddr=clientaddr;
		pthread_create(&tid,NULL,doit,(void*)newarg);
	}
    exit(0);
}


/*
 * parse_uri - URI parser
 * 
 * Given a URI from an HTTP proxy GET request (i.e., a URL), extract
 * the host name, path name, and port.  The memory for hostname and
 * pathname must already be allocated and should be at least MAXLINE
 * bytes. Return -1 if there are any problems.
 */
int parse_uri(char *uri, char *hostname, char *pathname, int *port)
{
    char *hostbegin;
    char *hostend;
    char *pathbegin;
    int len;

    if (strncasecmp(uri, "http://", 7) != 0) {
        hostname[0] = '\0';
        return -1;
    }

    /* Extract the host name */
    hostbegin = uri + 7;
    hostend = strpbrk(hostbegin, " :/\r\n\0");
    len = hostend - hostbegin;
    strncpy(hostname, hostbegin, len);
    hostname[len] = '\0';

    /* Extract the port number */
    *port = 80; /* default */
    if (*hostend == ':')   
        *port = atoi(hostend + 1);

    /* Extract the path */
    pathbegin = strchr(hostbegin, '/');
    if (pathbegin == NULL) {
        pathname[0] = '\0';
    }
    else {
        pathbegin++;	
        strcpy(pathname, pathbegin);
    }

    return 0;
}

/*
 * format_log_entry - Create a formatted log entry in logstring. 
 * 
 * The inputs are the socket address of the requesting client
 * (sockaddr), the URI from the request (uri), and the size in bytes
 * of the response from the server (size).
 */
void format_log_entry(char *logstring, struct sockaddr_in *sockaddr, 
        char *uri, int size)
{
    time_t now;
    char time_str[MAXLINE];
    unsigned long host;
    unsigned char a, b, c, d;

    /* Get a formatted time string */
    now = time(NULL);
    strftime(time_str, MAXLINE, "%a %d %b %Y %H:%M:%S %Z", localtime(&now));

    /* 
     * Convert the IP address in network byte order to dotted decimal
     * form. Note that we could have used inet_ntoa, but chose not to
     * because inet_ntoa is a Class 3 thread unsafe function that
     * returns a pointer to a static variable (Ch 13, CS:APP).
     */
    host = ntohl(sockaddr->sin_addr.s_addr);
    a = host >> 24;
    b = (host >> 16) & 0xff;
    c = (host >> 8) & 0xff;
    d = host & 0xff;


    /* Return the formatted log entry string */
    sprintf(logstring, "%s: %d.%d.%d.%d %s %d\n", time_str, a, b, c, d, uri, size);
}

/*
*doit - deal with the request of the client
*/
void *doit(void* doitarg){
	pthread_detach(pthread_self());
	struct Doitarg* arg=(struct Doitarg*)doitarg;
	int port,proxyfd,size=0,rn;
	char method[MAXLINE],hostname[MAXLINE],uri[MAXLINE],pathname[MAXLINE],buf[MAXLINE],version[MAXLINE],state[MAXLINE],putin[MAXLINE];
	rio_t clientrio,proxyrio;
	//read request line
	Rio_readinitb(&clientrio,arg->fd);
	Rio_readlineb_w(&clientrio,buf,MAXLINE);
	sscanf(buf,"%s %s %s",method,uri,version);
	if(parse_uri(uri,hostname,pathname,&port)==-1)
	{
		Close(arg->fd);
		free(doitarg);
		return NULL;
	}
	P(&openclient);
	proxyfd=open_clientfd(hostname,port);
	V(&openclient);
	if(proxyfd<0)
	{
		Close(arg->fd);
		free(doitarg);
		return NULL;
	}
	Rio_readinitb(&proxyrio,proxyfd);
	sprintf(buf,"%s /%s %s\r\n",method,pathname,version);
	if(!Rio_writen_w(proxyfd,buf,strlen(buf)))
	{
		Close(proxyfd);
		Close(arg->fd);
		free(doitarg);
		return NULL;
	}
	//read request header
	while(1)
	{
		Rio_readlineb_w(&clientrio,buf,MAXLINE);
		if(!Rio_writen_w(proxyfd,buf,strlen(buf)))
		{
			Close(proxyfd);
			Close(arg->fd);
			free(doitarg);
			return NULL;
		}
		if(strcmp(buf,"\r\n")==0)
			break;
	}
	while(1)
	{
		rn=Rio_readlineb_w(&proxyrio,buf,MAXLINE);
		size+=rn;
		if(!Rio_writen_w(arg->fd,buf,strlen(buf)))
			break;
		//whether the reply from the server is HTTP 200
		if(strncasecmp(buf,"HTTP/",strlen("HTTP/"))==0)
		{
			int info;
			sscanf(buf,"%s%d%s",version,&info,state);
			if(info!=200)
			{
				while(1)
				{
					rn=Rio_readlineb_w(&proxyrio,buf,MAXLINE);
					size+=rn;
					if(!Rio_writen_w(arg->fd,buf,strlen(buf)))
						break;
					if(strcmp(buf,"\r\n")==0)
					{
						break;
					}
				}
				break;
			}
		}
		// read content-length
		if(strncasecmp(buf,"Content-Length:",strlen("Content-Length:"))==0)
		{
			int length=atoi(buf+strlen("Content-Length: "));
			while(1)
			{
				rn=Rio_readlineb_w(&proxyrio,buf,MAXLINE);
				size+=rn;
				if(!Rio_writen_w(arg->fd,buf,strlen(buf)))
					break;
				if(strcmp(buf,"\r\n")==0)
				{
					break;
				}
			}
			while(length>0)
			{
				int n=length-MAXLINE;
				if(n>0)
					rn=Rio_readnb_w(&proxyrio,buf,MAXLINE);
				else
					rn=Rio_readnb_w(&proxyrio,buf,length);
				if(!Rio_writen_w(arg->fd,buf,rn))
					break;
				length-=rn;
				size+=rn;
			}
			break;
		}
		//read chunk
		if(strncasecmp(buf,"Transfer-Encoding: chunked",strlen("Transfer-Encoding: chunked"))==0)
		{
			while(1){
				rn=Rio_readlineb_w(&proxyrio,buf,MAXLINE);
				size+=rn;
				if(!Rio_writen_w(arg->fd,buf,rn))
					break;
				if(strncasecmp(buf,"0\r\n",3)==0)
				{
					rn=Rio_readlineb_w(&proxyrio,buf,MAXLINE);
					size+=rn;
					Rio_writen_w(arg->fd,buf,rn);
					break;
				}
			}
			break;
		}
	}
	format_log_entry(putin,&arg->clientaddr,uri,size);
	P(&writefile);
	fwrite(putin,strlen(putin),1,arg->filefd);
	V(&writefile);
	Close(proxyfd);
	Close(arg->fd);
	free(doitarg);
	return NULL;
}


int Rio_writen_w(int fd, void *usrbuf, size_t n) 
{
    if (rio_writen(fd, usrbuf, n) != n)
	{
		printf("Rio_writen Error");
		return 0;
	}
	return 1;
}

ssize_t Rio_readnb_w(rio_t *rp, void *usrbuf, size_t n) 
{
    ssize_t rc;

    rc = rio_readnb(rp, usrbuf, n);
    return rc;
}

ssize_t Rio_readlineb_w(rio_t *rp, void *usrbuf, size_t maxlen) 
{
    ssize_t rc;

    rc = rio_readlineb(rp, usrbuf, maxlen);
    return rc;
} 
