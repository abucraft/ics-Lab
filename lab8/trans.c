//ID:5130379017 Name:﻿李晟
/* 
 * trans.c - Matrix transpose B = A^T
 *
 * Each transpose function must have a prototype of the form:
 * void trans(int M, int N, int A[N][M], int B[M][N]);
 *
 * A transpose function is evaluated by counting the number of misses
 * on a 1KB direct mapped cache with a block size of 32 bytes.
 */ 
#include <stdio.h>
#include "cachelab.h"

int is_transpose(int M, int N, int A[N][M], int B[M][N]);

/* 
 * transpose_submit - This is the solution transpose function that you
 *     will be graded on for Part B of the assignment. Do not change
 *     the description string "Transpose submission", as the driver
 *     searches for that string to identify the transpose function to
 *     be graded. 
 */
char transpose_submit_desc[] = "Transpose submission";
void transpose_submit(int M, int N, int A[N][M], int B[M][N])
{
	int i, j;
	if(M==32&&N==32)
	{
		int indexx,indexy;
		int a1,a2,a3,a4,a5,a6,a7,a8;
		for(indexx=0;indexx<N/8;indexx++)
		{
			for(indexy=0;indexy<M/8;indexy++)
			{
			for (i = 0; i < 4; i++) {
           			a1 = A[i+indexx*8][indexy*8];
				a2=A[i+indexx*8][1+indexy*8];
				a3=A[i+indexx*8][2+indexy*8];
				a4=A[i+indexx*8][3+indexy*8];
				a5=A[i+indexx*8][4+indexy*8];
				a6=A[i+indexx*8][5+indexy*8];
				a7=A[i+indexx*8][6+indexy*8];
				a8=A[i+indexx*8][7+indexy*8];
				B[0+indexy*8][i+indexx*8]=a1;
				B[1+indexy*8][i+indexx*8]=a2;
				B[2+indexy*8][i+indexx*8]=a3;
				B[3+indexy*8][i+indexx*8]=a4;
				B[0+indexy*8][i+4+indexx*8]=a5;
				B[1+indexy*8][i+4+indexx*8]=a6;
				B[2+indexy*8][i+4+indexx*8]=a7;
				B[3+indexy*8][i+4+indexx*8]=a8;
    			}
			for (i = 0; i < 4; i++) {
           			a1 = A[i+4+indexx*8][indexy*8];
				a2=A[i+4+indexx*8][1+indexy*8];
				a3=A[i+4+indexx*8][2+indexy*8];
				a4=A[i+4+indexx*8][3+indexy*8];
				a5=A[i+4+indexx*8][4+indexy*8];
				a6=A[i+4+indexx*8][5+indexy*8];
				a7=A[i+4+indexx*8][6+indexy*8];
				a8=A[i+4+indexx*8][7+indexy*8];
				B[4+indexy*8][i+indexx*8]=a1;
				B[5+indexy*8][i+indexx*8]=a2;
				B[6+indexy*8][i+indexx*8]=a3;
				B[7+indexy*8][i+indexx*8]=a4;
				B[4+indexy*8][i+4+indexx*8]=a5;
				B[5+indexy*8][i+4+indexx*8]=a6;
				B[6+indexy*8][i+4+indexx*8]=a7;
				B[7+indexy*8][i+4+indexx*8]=a8;
			}
			for(i=0;i<4;i++)
			{
				
				
				a1=B[i+indexy*8][4+indexx*8];
				a2=B[i+indexy*8][5+indexx*8];
				a3=B[i+indexy*8][6+indexx*8];
				a4=B[i+indexy*8][7+indexx*8];
				a5=B[i+4+indexy*8][indexx*8];
				a6=B[i+4+indexy*8][1+indexx*8];
				a7=B[i+4+indexy*8][2+indexx*8];
				a8=B[i+4+indexy*8][3+indexx*8];
				B[i+4+indexy*8][indexx*8]=a1;
				B[i+4+indexy*8][1+indexx*8]=a2;
				B[i+4+indexy*8][2+indexx*8]=a3;
				B[i+4+indexy*8][3+indexx*8]=a4;
				B[i+indexy*8][4+indexx*8]=a5;
				B[i+indexy*8][5+indexx*8]=a6;
				B[i+indexy*8][6+indexx*8]=a7;
				B[i+indexy*8][7+indexx*8]=a8;
				
			}
			}
					    
		}
		return;
	}
	if(M==64&&N==64)
	{
		int indexx,indexy;
		int a1,a2,a3,a4,a5,a6,a7,a8;
		for(indexx=0;indexx<N/8;indexx++)
		{
			for(indexy=0;indexy<M/8;indexy++)
			{
			for (i = 0; i < 4; i++) {
           			a1 = A[i+indexx*8][indexy*8];
				a2=A[i+indexx*8][1+indexy*8];
				a3=A[i+indexx*8][2+indexy*8];
				a4=A[i+indexx*8][3+indexy*8];
				a5=A[i+indexx*8][4+indexy*8];
				a6=A[i+indexx*8][5+indexy*8];
				a7=A[i+indexx*8][6+indexy*8];
				a8=A[i+indexx*8][7+indexy*8];
				B[0+indexy*8][i+indexx*8]=a1;
				B[1+indexy*8][i+indexx*8]=a2;
				B[2+indexy*8][i+indexx*8]=a3;
				B[3+indexy*8][i+indexx*8]=a4;
				B[0+indexy*8][i+4+indexx*8]=a5;
				B[1+indexy*8][i+4+indexx*8]=a6;
				B[2+indexy*8][i+4+indexx*8]=a7;
				B[3+indexy*8][i+4+indexx*8]=a8;
    			}
			for(i=0;i<4;i++)
			{
				a5=A[4+indexx*8][i+indexy*8];
				a6=A[5+indexx*8][i+indexy*8];
				a7=A[6+indexx*8][i+indexy*8];
				a8=A[7+indexx*8][i+indexy*8];
				a1=B[i+indexy*8][4+indexx*8];
				a2=B[i+indexy*8][5+indexx*8];
				a3=B[i+indexy*8][6+indexx*8];
				a4=B[i+indexy*8][7+indexx*8];
				B[i+indexy*8][4+indexx*8]=a5;
				B[i+indexy*8][5+indexx*8]=a6;
				B[i+indexy*8][6+indexx*8]=a7;
				B[i+indexy*8][7+indexx*8]=a8;
				B[i+4+indexy*8][indexx*8]=a1;
				B[i+4+indexy*8][1+indexx*8]=a2;
				B[i+4+indexy*8][2+indexx*8]=a3;
				B[i+4+indexy*8][3+indexx*8]=a4;
				
			}
			for(i=0;i<4;i++)
			{
				a1=A[i+4+indexx*8][4+indexy*8];
				a2=A[i+4+indexx*8][5+indexy*8];
				a3=A[i+4+indexx*8][6+indexy*8];
				a4=A[i+4+indexx*8][7+indexy*8];
				B[4+indexy*8][i+4+indexx*8]=a1;
				B[5+indexy*8][i+4+indexx*8]=a2;
				B[6+indexy*8][i+4+indexx*8]=a3;
				B[7+indexy*8][i+4+indexx*8]=a4;
			}
			}
					    
		}
		return;
	}
	if(M==61&&N==67)
	{
		int indexx,indexy;
		int a1,a2,a3,a4,a5,a6;
		for(indexx=0;indexx<11;indexx++)
		{
			for(indexy=0;indexy<10;indexy++)
			{
				for(i=0;i<6;i++)
				{
					a1=A[0+indexx*6][i+indexy*6];
					a2=A[1+indexx*6][i+indexy*6];
					a3=A[2+indexx*6][i+indexy*6];
					a4=A[3+indexx*6][i+indexy*6];
					a5=A[4+indexx*6][i+indexy*6];
					a6=A[5+indexx*6][i+indexy*6];
					B[i+indexy*6][0+indexx*6]=a1;
					B[i+indexy*6][1+indexx*6]=a2;
					B[i+indexy*6][2+indexx*6]=a3;
					B[i+indexy*6][3+indexx*6]=a4;
					B[i+indexy*6][4+indexx*6]=a5;
					B[i+indexy*6][5+indexx*6]=a6;
				}
			}
		}
		for(i=0;i<67;i++)
		{
			B[60][i]=A[i][60];
		}
		for(i=0;i<61;i++)
		{
			B[i][66]=A[66][i];
		}
		return;
		
	}			
    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            B[j][i] = A[i][j];
        }
    }    
}

/* 
 * You can define additional transpose functions below. We've defined
 * a simple one below to help you get started. 
 */ 

/* 
 * trans - A simple baseline transpose function, not optimized for the cache.
 */
char trans_desc[] = "Simple row-wise scan transpose";
void trans(int M, int N, int A[N][M], int B[M][N])
{
    int i, j, tmp;

    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            tmp = A[i][j];
            B[j][i] = tmp;
        }
    }    

}
char trans_test[] ="Test trans 64x64";
void trans_test_func(int M, int N, int A[N][M], int B[M][N])
{
	int i;
	if(M==64&&N==64)
	{
		int indexx,indexy;
		int a1,a2,a3,a4,a5,a6,a7,a8;
		for(indexx=0;indexx<N/8;indexx++)
		{
			for(indexy=0;indexy<M/8;indexy++)
			{
			for (i = 0; i < 4; i++) {
           			a1 = A[i+indexx*8][indexy*8];
				a2=A[i+indexx*8][1+indexy*8];
				a3=A[i+indexx*8][2+indexy*8];
				a4=A[i+indexx*8][3+indexy*8];
				a5=A[i+indexx*8][4+indexy*8];
				a6=A[i+indexx*8][5+indexy*8];
				a7=A[i+indexx*8][6+indexy*8];
				a8=A[i+indexx*8][7+indexy*8];
				B[0+indexy*8][i+indexx*8]=a1;
				B[1+indexy*8][i+indexx*8]=a2;
				B[2+indexy*8][i+indexx*8]=a3;
				B[3+indexy*8][i+indexx*8]=a4;
				B[0+indexy*8][i+4+indexx*8]=a5;
				B[1+indexy*8][i+4+indexx*8]=a6;
				B[2+indexy*8][i+4+indexx*8]=a7;
				B[3+indexy*8][i+4+indexx*8]=a8;
    			}
			for(i=0;i<4;i++)
			{
				a5=A[4+indexx*8][i+indexy*8];
				a6=A[5+indexx*8][i+indexy*8];
				a7=A[6+indexx*8][i+indexy*8];
				a8=A[7+indexx*8][i+indexy*8];
				a1=B[i+indexy*8][4+indexx*8];
				a2=B[i+indexy*8][5+indexx*8];
				a3=B[i+indexy*8][6+indexx*8];
				a4=B[i+indexy*8][7+indexx*8];
				B[i+indexy*8][4+indexx*8]=a5;
				B[i+indexy*8][5+indexx*8]=a6;
				B[i+indexy*8][6+indexx*8]=a7;
				B[i+indexy*8][7+indexx*8]=a8;
				B[i+4+indexy*8][indexx*8]=a1;
				B[i+4+indexy*8][1+indexx*8]=a2;
				B[i+4+indexy*8][2+indexx*8]=a3;
				B[i+4+indexy*8][3+indexx*8]=a4;
				
			}
			for(i=0;i<4;i++)
			{
				a1=A[i+4+indexx*8][4+indexy*8];
				a2=A[i+4+indexx*8][5+indexy*8];
				a3=A[i+4+indexx*8][6+indexy*8];
				a4=A[i+4+indexx*8][7+indexy*8];
				B[4+indexy*8][i+4+indexx*8]=a1;
				B[5+indexy*8][i+4+indexx*8]=a2;
				B[6+indexy*8][i+4+indexx*8]=a3;
				B[7+indexy*8][i+4+indexx*8]=a4;
			}
			}
					    
		}
		return;
	}
	if(M==61&&N==67)
	{
		int indexx,indexy;
		int a1,a2,a3,a4,a5,a6;
		for(indexx=0;indexx<11;indexx++)
		{
			for(indexy=0;indexy<10;indexy++)
			{
				for(i=0;i<6;i++)
				{
					a1=A[i+indexx*6][indexy*6];
					a2=A[i+indexx*6][1+indexy*6];
					a3=A[i+indexx*6][2+indexy*6];
					a4=A[i+indexx*6][3+indexy*6];
					a5=A[i+indexx*6][4+indexy*6];
					a6=A[i+indexx*6][5+indexy*6];
					B[indexy*6][i+indexx*6]=a1;
					B[1+indexy*6][i+indexx*6]=a2;
					B[2+indexy*6][i+indexx*6]=a3;
					B[3+indexy*6][i+indexx*6]=a4;
					B[4+indexy*6][i+indexx*6]=a5;
					B[5+indexy*6][i+indexx*6]=a6;
				}
			}
		}
		for(i=0;i<67;i++)
		{
			B[60][i]=A[i][60];
		}
		for(i=0;i<61;i++)
		{
			B[i][66]=A[66][i];
		}
		
	}
	else
	{
	int j;			
    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            B[j][i] = A[i][j];
        }
    }    
	}
}
/*
 * registerFunctions - This function registers your transpose
 *     functions with the driver.  At runtime, the driver will
 *     evaluate each of the registered functions and summarize their
 *     performance. This is a handy way to experiment with different
 *     transpose strategies.
 */
void registerFunctions()
{
    /* Register your solution function */
    registerTransFunction(transpose_submit, transpose_submit_desc); 

    /* Register any additional transpose functions */
    registerTransFunction(trans, trans_desc); 

	registerTransFunction(trans_test_func, trans_test); 

}

/* 
 * is_transpose - This helper function checks if B is the transpose of
 *     A. You can check the correctness of your transpose by calling
 *     it before returning from the transpose function.
 */
int is_transpose(int M, int N, int A[N][M], int B[M][N])
{
    int i, j;

    for (i = 0; i < N; i++) {
        for (j = 0; j < M; ++j) {
            if (A[i][j] != B[j][i]) {
                return 0;
            }
        }
    }
    return 1;
}

