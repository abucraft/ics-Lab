/*
 * mm-naive.c - The fastest, least memory-efficient malloc package.
 * 
 * In this naive approach, a block is allocated by simply incrementing
 * the brk pointer.  A block is pure payload. There are no headers or
 * footers.  Blocks are never coalesced or reused. Realloc is
 * implemented directly using mm_malloc and mm_free.
 *
 * NOTE TO STUDENTS: Replace this header comment with your own header
 * comment that gives a high level description of your solution.
 */
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <unistd.h>
#include <string.h>

#include "mm.h"
#include "memlib.h"

/*********************************************************
 * NOTE TO STUDENTS: Before you do anything else, please
 * provide your team information in the following struct.
 ********************************************************/
team_t team = {
    /* Team name */
    "5130379017",
    /* First member's full name */
    "lisheng",
    /* First member's email address */
    "499817366@qq.com",
    /* Second member's full name (leave blank if none) */
    "",
    /* Second member's email address (leave blank if none) */
    ""
};

/* single word (4) or double word (8) alignment */
#define ALIGNMENT 8

/* rounds up to the nearest multiple of ALIGNMENT */
#define ALIGN(size) (((size) + (ALIGNMENT-1)) & ~0x7)


#define SIZE_T_SIZE (ALIGN(sizeof(size_t)))

#define WSIZE	4		//Word and header/footer size (bytes)
#define DSIZE	8		//Double word size (bytes)
#define CHUNKSIZE	(1<<12)	//Extend heap by this amount (bytes)

#define MAX(x,y) ((x)>(y)?(x):(y))

/* Pack a size and allocated bit into a word */
#define PACK(size,alloc)	((size)|(alloc))

/* Read and write a word at address p */
#define GET(p)		(*(unsigned int *)(p))
#define PUT(p,val)	(*(unsigned int *)(p)=(val))
#define GETPOINT(p)	(*(void **)(p))
#define PUTPOINT(p,val)	(*(void **)(p)=(val))
#define NEXTPOINT(p)	((char *)(p) + WSIZE)

/* Read the size and allocared fields from address p */
#define GET_SIZE(p)	(GET(p) & ~0x7)
#define GET_ALLOC(p)	(GET(p) & 0x1)

/* Given block ptr bp, compute address of its header and footer */
#define HDRP(bp)	((char *)(bp) - WSIZE)
#define FTRP(bp)	((char *)(bp) + GET_SIZE(HDRP(bp))-DSIZE)

/* Given block ptr bp, compute address of next and previous blocks */
#define NEXT_BLKP(bp)	((char *)(bp)+GET_SIZE(((char *)(bp) - WSIZE)))
#define PREV_BLKP(bp)	((char *)(bp)-GET_SIZE(((char *)(bp) - DSIZE)))

static void *heap_listp = NULL;
static void *free_listp = NULL;
static void *extend_heap(size_t words);
static void *coalesce(void *bp);
static void *find_fit(size_t asize);
static void place(void *bp,size_t asize);
static void delete_freemm(void *bp);
static int mm_check();
/* 
 * mm_init - initialize the malloc package.
 */
int mm_init(void)
{
/*Create the initial empty heap*/
    if(free_listp!=NULL)
	free_listp=NULL;
    if((heap_listp=mem_sbrk(4*WSIZE)) == (void *)-1)
	return -1;
    PUT(heap_listp,0);				//Alignment padding
    PUT(heap_listp + (1*WSIZE),PACK(DSIZE,1));	//Prologue header
    PUT(heap_listp + (2*WSIZE),PACK(DSIZE,1));	//Prologue footer
    PUT(heap_listp + (3*WSIZE),PACK(0,1));	//E[ilogue header
    //printf("heap_listp %x \n",heap_listp);
    heap_listp += (2*WSIZE);
    
    //printf("heap_listp %x \n",heap_listp);
/* Extend the empty heap with a free block of CHUNKSIZE bytes*/
    if(extend_heap(CHUNKSIZE/WSIZE) == NULL)
	return -1;
    return 0;
}

/* 
 * mm_malloc - Allocate a block by incrementing the brk pointer.
 *     Always allocate a block whose size is a multiple of the alignment.
 */
void *mm_malloc(size_t size)
{
    size_t asize;	/*Adjusted block size*/
    size_t extendsize;	//Amount to extend heap if no fit
    char *bp;

    /* Ignore spurious requests */
    if(size == 0)
	return NULL;

    /* Adjust block size to include overhead and alignment reqs. */
    if(size <= DSIZE)
	asize = 2*DSIZE;
    else 
	asize = DSIZE *((size +(DSIZE)+(DSIZE-1))/DSIZE);

    /*Search the free list for a fit*/
    /*if(mm_check()==0)
    {
	printf("in malloc mm_check fail\n");
	return NULL;
    }*/
    if((bp=find_fit(asize))!=NULL){
	place(bp , asize);
	return bp;
    }

    /*No fit found. Get more memory and place the block */
    extendsize=MAX(asize,CHUNKSIZE);
    if((bp=extend_heap(extendsize/WSIZE))==NULL)
	return NULL;
    /*if(mm_check()==0)
    {
	printf("in malloc extend mm_check fail\n");
	return NULL;
    }*/
    place(bp,asize);
    return bp;
}

/*
 * mm_free - Freeing a block does nothing.
 */
void mm_free(void *bp)
{
//printf("free at %x \n",bp);
    size_t size = GET_SIZE(HDRP(bp));

    PUT(HDRP(bp),PACK(size,0));
    PUT(FTRP(bp),PACK(size,0));
    PUTPOINT(bp,NULL);
    PUTPOINT(NEXTPOINT(bp),NULL);
    coalesce(bp);
    /*printf("after free\n");
    if(mm_check()==0)
    {
	printf("in free mm_check fail\n");
	return NULL;
    }*/
}

/*
 * mm_realloc - Implemented simply in terms of mm_malloc and mm_free
 */
void *mm_realloc(void *ptr, size_t size)
{
    void *oldptr = ptr;
    void *newptr;
    size_t mem_size=GET_SIZE(HDRP(oldptr));
    size_t nmem_size;
    size_t asize,copySize;
    if(size==0)
    {
	mm_free(ptr);
	return NULL;
    }
    if(size <= DSIZE)
	asize = 2*DSIZE;
    else 
	asize = DSIZE *((size +(DSIZE)+(DSIZE-1))/DSIZE);
    /*printf("in realloc\n");
    printf("%x\n",free_listp);
    if(mm_check()==0)
    {
	printf("mm_check fail\n");
	return NULL;
    }*/
    if(asize <= mem_size)
	return ptr;
    if(!GET_ALLOC(HDRP(NEXT_BLKP(oldptr))))
    {
	//printf("oldptr %x\n",oldptr);
	//printf("next %x %x\n",NEXT_BLKP(oldptr),GET_ALLOC(HDRP(NEXT_BLKP(oldptr))));
	nmem_size=GET_SIZE(HDRP(NEXT_BLKP(oldptr)));
	if((mem_size+nmem_size) >= (asize+2*DSIZE))
	{
	    void *free_prev = GETPOINT(NEXT_BLKP(oldptr));
	    void *free_next = GETPOINT(NEXTPOINT(NEXT_BLKP(oldptr)));
	    PUT(HDRP(oldptr),PACK(asize,1));
	    PUT(FTRP(oldptr),PACK(asize,1));
	    /*printf("change oldptr\n");
	    printf("free_prev %x\n",free_prev);
	    printf("free_next %x\n",free_next);*/
	    newptr=NEXT_BLKP(oldptr);
	    //printf("nextptr %x\n",newptr);
	    PUTPOINT(newptr,free_prev);
	    PUTPOINT(NEXTPOINT(newptr),free_next);
	    //printf("set point ok\n");
	    PUT(HDRP(newptr),PACK(mem_size+nmem_size-asize,0));
	    PUT(FTRP(newptr),PACK(mem_size+nmem_size-asize,0));
	    //printf("set new blk ok\n");
	    if(free_prev!=NULL)
	    {
		PUTPOINT(NEXTPOINT(free_prev),newptr);
		//printf("set free_prev ok\n");
	    }
	    else
	        free_listp=newptr;
	    if(free_next!=NULL)
		PUTPOINT(free_next,newptr);
	    //printf("realloc ok\n");
	    return oldptr;
	}
	else if((mem_size+nmem_size) >= asize)
	{
	    delete_freemm(NEXT_BLKP(oldptr));
	    PUT(HDRP(oldptr),PACK(mem_size+nmem_size,1));
	    PUT(FTRP(oldptr),PACK(mem_size+nmem_size,1));
	    return oldptr;
	}
    }
    newptr = mm_malloc(size);
    if(newptr == NULL)
	return NULL;
    copySize = GET_SIZE(HDRP(oldptr))-DSIZE;
    memcpy(newptr,oldptr,copySize);
    mm_free(oldptr);
    return newptr;
    /*if(mem_size>=(asize+2*DSIZE))
    {
	PUT(HDRP(ptr),PACK(asize,1));
	PUT(FTRP(ptr),PACK(asize,1));
	PUT(HDRP(NEXT_BLKP(ptr)),PACK(mem_size-asize,0));
	PUT(FTRP(NEXT_BLKP(ptr)),PACK(mem_size-asize,0));
	mm_free(NEXT_BLKP(ptr));
	return ptr;
    }
    else if(mem_size>=asize)
    {
	return ptr;
    }
    else
    {
	newptr = mm_malloc(size);
	if(newptr == NULL)
	    return NULL;
	copySize = GET_SIZE(HDRP(oldptr))-DSIZE;
	memcpy(newptr,oldptr,copySize);
	mm_free(oldptr);
	return newptr;
    }*/

    /*void *oldptr = ptr;
    void *newptr;
    size_t copySize;
    
    newptr = mm_malloc(size);
    if (newptr == NULL)
      return NULL;
    copySize = *(size_t *)((char *)oldptr - 4);
    if (size < copySize)
      copySize = size;
    memcpy(newptr, oldptr, copySize);
    mm_free(oldptr);
    return newptr;*/
}

static void *extend_heap(size_t words)
{
    char *bp;
    size_t size;

/*Allocate an even number of words to maintain alignment*/
    size = (words %2)?(words+1)*WSIZE :words * WSIZE;
    if((long)(bp= mem_sbrk(size)) == -1)
	return NULL;

/*Initialize free block header/footer and the epilogue header*/
    PUT(HDRP(bp),PACK(size,0));		//Free block header
    PUT(FTRP(bp),PACK(size,0));		//Free block footer
    PUT(HDRP(NEXT_BLKP(bp)),PACK(0,1));	//New epilogue header
    PUTPOINT(bp,NULL);
    PUTPOINT(NEXTPOINT(bp),NULL);
/*Coalesce if the previous block was free*/
    return coalesce(bp);
}


static void *coalesce(void *bp)
{
    size_t prev_alloc = GET_ALLOC(FTRP(PREV_BLKP(bp)));
    size_t next_alloc = GET_ALLOC(HDRP(NEXT_BLKP(bp)));
    size_t size = GET_SIZE(HDRP(bp));
    void *free_prev;
    void *free_next;
    if(prev_alloc && next_alloc){		//Case 1
	if(free_listp!=NULL)
	{
	    PUTPOINT(free_listp,bp);
	    PUTPOINT(NEXTPOINT(bp),free_listp);
	}
	free_listp=bp;
	return bp;
    }

    else if (prev_alloc && !next_alloc){	//Case 2
	free_prev=GETPOINT(NEXT_BLKP(bp));
	free_next=GETPOINT(NEXTPOINT(NEXT_BLKP(bp)));
	PUTPOINT(bp,free_prev);
	PUTPOINT(NEXTPOINT(bp),free_next);
	if(free_prev!=NULL)
	    PUTPOINT(NEXTPOINT(free_prev),bp);
	else
	    free_listp=bp;
	if(free_next!=NULL)
	    PUTPOINT(free_next,bp);
	size += GET_SIZE(HDRP(NEXT_BLKP(bp)));
	PUT(HDRP(bp),PACK(size,0));
	PUT(FTRP(bp),PACK(size,0));
    }

    else if (!prev_alloc && next_alloc){	//Case 3
	size += GET_SIZE(HDRP(PREV_BLKP(bp)));
	PUT(FTRP(bp),PACK(size,0));
	PUT(HDRP(PREV_BLKP(bp)),PACK(size,0));
	bp= PREV_BLKP(bp);
    }

    else{					//Case 4
	delete_freemm(NEXT_BLKP(bp));
	size += GET_SIZE(HDRP(PREV_BLKP(bp)))+
	    GET_SIZE(FTRP(NEXT_BLKP(bp)));
	PUT(HDRP(PREV_BLKP(bp)),PACK(size,0));
	PUT(FTRP(NEXT_BLKP(bp)),PACK(size,0));
	bp = PREV_BLKP(bp);
    }

    return bp;
}



static void *find_fit(size_t asize)
{
    /*First fit search */
    void *bp;

    //for(bp = heap_listp;GET_SIZE(HDRP(bp))>0;bp=NEXT_BLKP(bp)){
    for(bp=free_listp;bp!=NULL;bp=GETPOINT(bp+WSIZE)){
	if(/*!GET_ALLOC(HDRP(bp))&&*/(asize<=GET_SIZE(HDRP(bp)))){
	     return bp;
	}
    }
    return NULL;
}


static void place(void *bp,size_t asize)
{
    size_t csize=GET_SIZE(HDRP(bp));
    void *free_prev=GETPOINT(bp);
    void *free_next=GETPOINT(NEXTPOINT(bp));
    if((csize-asize)>=(2*DSIZE)){
	PUT(HDRP(bp),PACK(asize ,1));
	PUT(FTRP(bp),PACK(asize ,1));
//printf("alloc at %x\n",bp);
	bp=NEXT_BLKP(bp);
	PUTPOINT(bp,free_prev);
	PUTPOINT(NEXTPOINT(bp),free_next);
	if(free_prev!=NULL)
	    PUTPOINT(NEXTPOINT(free_prev),bp);
	else
	    free_listp=bp;
	if(free_next!=NULL)
	    PUTPOINT(free_next,bp);
	PUT(HDRP(bp),PACK(csize-asize,0));
	PUT(FTRP(bp),PACK(csize-asize,0));
	//printf("after cut\n");
    }
    else{
	delete_freemm(bp);
	PUT(HDRP(bp),PACK(csize,1));
	PUT(FTRP(bp),PACK(csize,1));
	//printf("no cut\n");
//printf("alloc at %x\n",bp);
    }
}


static int mm_check()
{
    void *bp=heap_listp;
    void *fp=free_listp;
    int alloc=0;
    size_t size=0;
    for(bp = heap_listp;GET_SIZE(HDRP(bp))>0;bp=NEXT_BLKP(bp)){
	alloc=GET_ALLOC(HDRP(bp));
	size =GET_SIZE(HDRP(bp));
	//printf("m %x %x %x %x\n",bp,size,alloc,GET_ALLOC(FTRP(bp)));
	if(GET_ALLOC(FTRP(bp))!=alloc)
	{
	    printf("alloc different\n");
	    return 0;
	}
	if(GET_SIZE(FTRP(bp))!=size)
	{
	    printf("size different\n");
	    return 0;
	}
    }
    printf("alloc not failed\n");
    for(fp=free_listp;fp!=NULL;fp=GETPOINT(((char *)fp+WSIZE))){
	printf("f %x %x %x %x %x\n",fp,GET_ALLOC(HDRP(fp)),GET_ALLOC(FTRP(fp)),GETPOINT(fp),GETPOINT(NEXTPOINT(fp)));
	if(!((!GET_ALLOC(HDRP(fp))) && (!GET_ALLOC(FTRP(fp)))))
        {
	    printf("free failed\n");
	    return 0;
	}
	if(GETPOINT(fp)==fp)
	{
	    printf("free prev is itself\n");
	    return 0;
	}
	if(GETPOINT((char *)(fp)+WSIZE)==fp)
	{
	    printf("free next is itself\n");
	    return 0;
	}
    }
    return 1;
}


static void delete_freemm(void *bp)
{
    if(bp!=NULL)
    {
	void *free_prev=GETPOINT(bp);
	void *free_next=GETPOINT(NEXTPOINT(bp));
	if(free_prev!=NULL&&free_next!=NULL)
	{
	    PUTPOINT(NEXTPOINT(free_prev),free_next);
	    PUTPOINT(free_next,free_prev);
	}
	else if(free_prev!=NULL && free_next==NULL)
	    PUTPOINT(NEXTPOINT(free_prev),free_next);
	else if(free_prev==NULL && free_next!=NULL)
	{
	    PUTPOINT(free_next,NULL);
	    free_listp = free_next;
	}
	else
	    free_listp = NULL;
    }
}




